import { createReducer, on } from "@ngrx/store";
import { loadEmployeeListSuccess } from "../actions/employees.action";
import { initialEmployeeState } from "../states/employees.state";

export const EmployeeReducers = createReducer(
  initialEmployeeState,

  on(loadEmployeeListSuccess, (state, action) => {
    return {
      ...state,
      employees: action.response
    }
  })
)