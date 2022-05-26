import { createAction, props } from "@ngrx/store";
import { IEmployees } from "src/app/core/interfaces/employees";

export enum EmployeesActionTypeEnum {
  LOAD_EMPLOYEES_LIST = '[employees page] load list of employees',
  LOAD_EMPLOYEES_LIST_SUCCESS = '[employees page] load list of employees success',

  ADD_NEW_EMPLOYEES = '[employees form page] add new employees',
  EDIT_EMPLOYEES_BY_ID = '[employees employees page] edit employees by id',
  DELETE_EMPLOYEES_BY_ID = '[employees page] delete employees by id',
}

export const loadEmployeeList = createAction(
  EmployeesActionTypeEnum.LOAD_EMPLOYEES_LIST,
  props<{ _page?: number, _limit?: number, fullName?: string, company?: string, email?: string }>()
);

export const loadEmployeeListSuccess = createAction(
  EmployeesActionTypeEnum.LOAD_EMPLOYEES_LIST_SUCCESS,
  props<{ response: IEmployees[] }>()
);

export const addNewEmployee = createAction(
  EmployeesActionTypeEnum.ADD_NEW_EMPLOYEES,
  props<{ payload: IEmployees }>()
);

export const editEmployeeById = createAction(
  EmployeesActionTypeEnum.EDIT_EMPLOYEES_BY_ID,
  props<{ payload: IEmployees, id: number }>()
)

export const deleteEmployeeById = createAction(
  EmployeesActionTypeEnum.DELETE_EMPLOYEES_BY_ID,
  props<{ id: number }>()
)
