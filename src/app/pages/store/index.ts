import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { AppConst } from "src/app/helpers/app-constants";
import { EmployeeEffects } from "./effects/employees.effect";
import { EmployeeReducers } from "./reducers/employees.reducer";
import { EmployeeState } from "./states/employees.state";

export const getPagesState = createFeatureSelector<MainState>(AppConst.PAGES_FEATURE_SELECTOR);

export interface MainState {
  employeeState: EmployeeState
}

export const pagesReducers: ActionReducerMap<MainState> = {
  employeeState: EmployeeReducers
}

export const PagesEffects: any[] = [
  EmployeeEffects
];