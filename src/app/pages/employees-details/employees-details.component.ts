import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IEmployees } from 'src/app/core/interfaces/employees';
import { AppConst } from 'src/app/helpers/app-constants';
import { Utils } from 'src/app/helpers/utils';
import { AppState } from 'src/app/store';
import { getCurrentRoute } from 'src/app/store/router/router.selector';
import { getEmployeeById } from '../store/selectors/employees.selector';

@Component({
  selector: 'app-employees-details',
  templateUrl: './employees-details.component.html',
  styleUrls: ['./employees-details.component.css']
})
export class EmployeesDetailsComponent implements OnInit {

  employee: IEmployees = null!;
  userNotFoundMsg: string = "";
  queryParams: any = {
    pageSize: AppConst.PAGE_SIZE,
    pageNo: AppConst.PAGE_NO,
  }

  constructor(
    private store: Store<AppState>,
  ) { }

  async ngOnInit() {
    let route = await Utils.obserableToPromise(this.store.select(getCurrentRoute));
    if (route && route.params['id']) {
      this.store.select(getEmployeeById).subscribe((employee) => {
        if (employee) {
          this.userNotFoundMsg = "";
          this.employee = employee;
        } else {
          this.userNotFoundMsg = "User Not Found! please go back and try with another";
        }
      })
    } else {
      this.userNotFoundMsg = "User Not Found! please go back and try with another";
    }
  }

}
