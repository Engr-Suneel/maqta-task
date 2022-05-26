import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, exhaustMap, map } from "rxjs/operators";
import { EmployeesService } from "src/app/core/services/employees.service";
import { EventService } from "src/app/core/services/event.service";
import { AppConst } from "src/app/helpers/app-constants";
import { setLoader } from "src/app/layouts/store/actions/loader.actions";
import { AppState } from "src/app/store";
import { addNewEmployee, deleteEmployeeById, editEmployeeById, loadEmployeeList, loadEmployeeListSuccess } from "../actions/employees.action";

@Injectable()
export class EmployeeEffects {

  constructor(
    private employeeService: EmployeesService,
    private actions$: Actions,
    private store: Store<AppState>,
    private eventService: EventService,
  ) { }

  loadEmployeeList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEmployeeList),
      exhaustMap((action) => {

        let fromObject: any = {
          _page: action._page!,
          _limit: action._limit!,
        }
        if (action.fullName) {
          fromObject['fullName'] = action.fullName
        }
        if (action.company) {
          fromObject['company'] = action.company
        }
        if (action.email) {
          fromObject['email'] = action.email
        }

        const params = new HttpParams({
          fromObject
        });
        return this.employeeService.employees.all().pipe(
          map((data) => {
            if (data && data.length) {
              this.eventService.broadcast(AppConst.EVENT_EMPLOYEES_LOADED_SUCCESS, data.length);
            }
            this.store.dispatch(setLoader({ isLoading: false }));
            return loadEmployeeListSuccess({ response: data });
          }),
          catchError((error: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            return of(error)
          })
        )
      }
      )
    )
  );

  addNewEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewEmployee),
      exhaustMap((action) =>
        this.employeeService.employees.create(action.payload).pipe(
          map((data: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            this.eventService.broadcast(AppConst.EVENT_EMPLOYEES_ADDED_SUCCESS, data);
          }),
          catchError((error: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            return of(error)
          })
        )
      )
    ), { dispatch: false }
  );

  editEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editEmployeeById),
      exhaustMap((action) =>
        this.employeeService.employees.update(action.payload, action.id).pipe(
          map((data: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            this.eventService.broadcast(AppConst.EVENT_EMPLOYEES_EDITED_SUCCESS, data);
          }),
          catchError((error: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            return of(error)
          })
        )
      )
    ), { dispatch: false }
  );

  deleteEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteEmployeeById),
      exhaustMap((action) =>
        this.employeeService.employees.delete(action.id).pipe(
          map((data: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            this.eventService.broadcast(AppConst.EVENT_EMPLOYEES_DELETE_SUCCESS, data);
          }),
          catchError((error: any) => {
            this.store.dispatch(setLoader({ isLoading: false }));
            return of(error)
          })
        )
      )
    ), { dispatch: false }
  );
}