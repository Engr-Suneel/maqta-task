import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppConst } from '../helpers/app-constants';
import { pagesReducers, PagesEffects } from './store';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeesDetailsComponent } from './employees-details/employees-details.component';
import { EmployeesFormComponent } from './employees-form/employees-form.component';
import { EmployeesService } from '../core/services/employees.service';


@NgModule({
  declarations: [
    DashboardComponent,
    EmployeesComponent,
    EmployeesDetailsComponent,
    EmployeesFormComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(AppConst.PAGES_FEATURE_SELECTOR, pagesReducers),
    EffectsModule.forFeature(PagesEffects)
  ],
  providers: [
    EmployeesService
  ]
})
export class PagesModule { }
