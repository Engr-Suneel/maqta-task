import { createSelector } from "@ngrx/store";
import { RouterStateUrl } from "src/app/store/router/custom-serializer";
import { getCurrentRoute } from "src/app/store/router/router.selector";
import { getPagesState } from "..";

export const getEmployeesList = createSelector(getPagesState, (state) => {
  return state.employeeState.employees;
});

export const getEmployeeById = createSelector(
  getEmployeesList,
  getCurrentRoute,
  (employees, route: RouterStateUrl) => {
    return employees ? employees.find(o => o.id == route.params['id']) : null;
  }
);