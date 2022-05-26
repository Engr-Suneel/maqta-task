import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IEmployees } from 'src/app/core/interfaces/employees';
import { EventService } from 'src/app/core/services/event.service';
import { AppConst } from 'src/app/helpers/app-constants';
import { setLoader } from 'src/app/layouts/store/actions/loader.actions';
import { AppState } from 'src/app/store';
import { deleteEmployeeById, loadEmployeeList } from '../store/actions/employees.action';
import { getEmployeesList } from '../store/selectors/employees.selector';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  employees$: Observable<IEmployees[]> = null!;

  pageNo: number = AppConst.PAGE_NO;
  pageSize: number = AppConst.PAGE_SIZE;
  totalRecords: number = AppConst.TOTAL_RECORDS;
  fullName: string = "";
  company: string = "";
  email: string = "";

  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    let userLoaded = this.eventService.subscribe(AppConst.EVENT_EMPLOYEES_LOADED_SUCCESS, (totalRecords: number) => {
      if (this.totalRecords < totalRecords) {
        this.totalRecords = totalRecords;
      }
    });

    let userDelete = this.eventService.subscribe(AppConst.EVENT_EMPLOYEES_DELETE_SUCCESS, (result) => {
      this.loadEmployees();
    });

    this.subscription.add(userLoaded);
    this.subscription.add(userDelete);
  }

  ngOnInit() {
    this.employees$ = this.store.select(getEmployeesList);
    this.loadEmployees();
  }

  loadEmployees() {
    this.store.dispatch(setLoader({ isLoading: true }));
    this.store.dispatch(loadEmployeeList({ _page: this.pageNo, _limit: this.pageSize, fullName: this.fullName, company: this.company, email: this.email }));
  }

  onPageChange(pageNo: number) {
    this.pageNo = pageNo;
    this.changeQuery();
  }

  onRecordChange(pageSize: number) {
    this.pageSize = pageSize;
    this.changeQuery();
  }

  changeQuery() {
    this.router.navigate(['.'], {
      relativeTo: this.route, queryParams: {
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
    });
  }

  editEmployeeDetail(employee: IEmployees) {
    let id = employee ? employee.id : 0;
    this.router.navigate(['employees-form', id]);
  }

  viewEmployeeDetail(employee: IEmployees) {
    if (employee && employee.id) {
      this.router.navigate(['employees-details', employee.id]);
    }
  }

  deleteEmployee(employee: IEmployees) {
    if (employee && employee.id) {
      if (confirm("Are you sure you want to delete")) {
        this.store.dispatch(setLoader({ isLoading: true }));
        this.store.dispatch(deleteEmployeeById({ id: employee.id }));
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
