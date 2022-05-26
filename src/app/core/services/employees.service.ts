import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConst } from "src/app/helpers/app-constants";
import { IEmployees } from "../interfaces/employees";
import { ApiProvider } from "./api.provider.service";

@Injectable()
export class EmployeesService {
  constructor(
    private apiProvider: ApiProvider
  ) {

  }

  employees = {
    all: () => {
      let baseUrl = `${AppConst.BASE_URL}${AppConst.EMPLOYEES}`;
      return this.apiProvider.get<IEmployees[]>(baseUrl);
    },
    create: (payload: IEmployees) => {
      let baseUrl = `${AppConst.BASE_URL}${AppConst.EMPLOYEES}`;
      return this.apiProvider.post(baseUrl, payload);
    },
    update: (payload: IEmployees, id: number) => {
      let baseUrl = `${AppConst.BASE_URL}${AppConst.EMPLOYEES}/${id}`;
      return this.apiProvider.put(baseUrl, payload);
    },
    delete: (id: number) => {
      let baseUrl = `${AppConst.BASE_URL}${AppConst.EMPLOYEES}/${id}`;
      return this.apiProvider.delete(baseUrl);
    }
  }
}