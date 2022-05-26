import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from '../helpers/app-route.constants';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesDetailsComponent } from './employees-details/employees-details.component';
import { EmployeesFormComponent } from './employees-form/employees-form.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
  { path: '', redirectTo: AppRoute.ROUTE_DASHBOARD },
  { path: AppRoute.ROUTE_DASHBOARD, component: DashboardComponent },
  { path: AppRoute.ROUTE_EMPLOYEES, component: EmployeesComponent },
  { path: AppRoute.ROUTE_EMPLOYEES_DETAILS, component: EmployeesDetailsComponent },
  { path: AppRoute.ROUTE_EMPLOYEES_FORM, component: EmployeesFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
