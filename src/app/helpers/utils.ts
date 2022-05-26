import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { IGender } from "../core/interfaces/gender";

export class Utils {
  static obserableToPromise<T>(observable: Observable<T>): Promise<T> {
    return observable?.pipe(take(1)).toPromise();
  }

  static getGenderList(): IGender[] {
    return [
      { id: true, value: "Male" },
      { id: false, value: "Female" },
    ]
  }
}