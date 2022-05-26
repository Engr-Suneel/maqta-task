import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IEmployees } from 'src/app/core/interfaces/employees';
import { IGender } from 'src/app/core/interfaces/gender';
import { EventService } from 'src/app/core/services/event.service';
import { AppConst } from 'src/app/helpers/app-constants';
import { AppRoute } from 'src/app/helpers/app-route.constants';
import { Utils } from 'src/app/helpers/utils';
import { setLoader } from 'src/app/layouts/store/actions/loader.actions';
import { AppState } from 'src/app/store';
import { getCurrentRoute } from 'src/app/store/router/router.selector';
import { addNewEmployee, editEmployeeById } from '../store/actions/employees.action';
import { getEmployeeById } from '../store/selectors/employees.selector';
import * as moment from 'moment';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.css']
})
export class EmployeesFormComponent implements OnInit, OnDestroy {

  employeeFormGroup: FormGroup;
  fullName: FormControl;
  dob: FormControl;
  email: FormControl;
  phone: FormControl;
  gender: FormControl;
  company: FormControl;
  position: FormControl;

  submitted: boolean = false;
  queryParams: any = {
    pageSize: AppConst.PAGE_SIZE,
    pageNo: AppConst.PAGE_NO,
  }
  title: string = "Create User";
  genderList: IGender[] = [];
  isEdit: boolean = false;
  userNotFoundMsg: string = "";
  successMsg: string = "";
  editId: any;

  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private eventService: EventService,
    private router: Router
  ) {

    this.fullName = new FormControl('', [Validators.required]);
    this.dob = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.phone = new FormControl('', [Validators.required]);
    this.gender = new FormControl('', [Validators.required]);
    this.company = new FormControl('', [Validators.required]);
    this.position = new FormControl('', [Validators.required]);

    this.employeeFormGroup = this.fb.group({
      fullName: this.fullName,
      dob: this.dob,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      company: this.company,
      position: this.position
    });

    let addedSuccess = this.eventService.subscribe(AppConst.EVENT_EMPLOYEES_ADDED_SUCCESS, () => {
      this.successMsg = "User Successfully created! please go back and check the result!";
      this.goToList(); // I added this because of refresh whole page
    });

    let updateSuccess = this.eventService.subscribe(AppConst.EVENT_EMPLOYEES_EDITED_SUCCESS, () => {
      this.successMsg = "User data saved successfully! please go back and check the result!";
      this.goToList(); // I added this because of refresh whole page
    });

    this.subscription.add(addedSuccess);
    this.subscription.add(updateSuccess);
  }

  goToList() {
    this.router.navigate([AppRoute.ROUTE_EMPLOYEES], { queryParams: this.queryParams });
  }

  async ngOnInit() {
    this.genderList = Utils.getGenderList();
    let route = await Utils.obserableToPromise(this.store.select(getCurrentRoute));

    if (route && route.params['id'] != "0") {
      this.title = "Edit User";
      this.isEdit = true;
      this.userNotFoundMsg = "";
      this.editId = route.params['id'];

      this.store.select(getEmployeeById).subscribe((employee) => {
        if (employee) {
          this.employeeFormGroup.patchValue({
            fullName: employee.fullName,
            dob: moment(employee.dob, "MMM D, YYYY hh:mm A", true).format("YYYY-MM-DD"),
            email: employee.email,
            phone: employee.phone,
            gender: employee.gender,
            company: employee.company,
            position: employee.position
          });
        } else {
          this.userNotFoundMsg = "User Not Found! please go back and try with another";
        }
      })
    }
  }

  get f() {
    return this.employeeFormGroup.controls;
  }

  submit() {
    this.submitted = true;
    if (this.employeeFormGroup.invalid) {
      return;
    }

    let payload = this.employeeFormGroup.value as IEmployees;
    payload.dob = moment(payload.dob, "YYYY-MM-DD", true).format("MMM D, YYYY hh:mm A");

    if (!payload) {
      return;
    }

    this.store.dispatch(setLoader({ isLoading: true }));
    if (this.isEdit) {
      payload.id = parseInt(this.editId);
      this.store.dispatch(editEmployeeById({ payload, id: parseInt(this.editId) }));
    } else {
      payload.id = new Date().getTime();
      this.store.dispatch(addNewEmployee({ payload }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
