import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(
    private generalService: GeneralService,
    private http: HttpClient,
  ) {
  }

  logout() {
    localStorage.removeItem("user_info");
    navigator.serviceWorker.controller?.postMessage({
      type: 'REMOVE_TOKEN'
    });
  }


  login(parametros: any): Observable<any> {
    return this.generalService.postData<Request, any>(`${environment.api}/external/users/login`, parametros);
  }


}
