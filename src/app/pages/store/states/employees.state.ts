import { IEmployees } from "src/app/core/interfaces/employees";

export interface EmployeeState {
  employees: Array<IEmployees>;
}

export const initialEmployeeState: EmployeeState = {
  employees: []
}