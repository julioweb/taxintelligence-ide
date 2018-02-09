import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { RuleTotList } from "../../../models/RuleTot";
import { ServiceUtils } from "../../Utils/Utils";



@Injectable()
export class RuleService {  

  private serviceUtils = new ServiceUtils();
  private _ruleSvcUrl:string = `${environment.UrlApiTaxIntelligence}Rules/`;

  constructor(private http: Http,
    private authService: AuthService) { }

    GetRuleTotCount(Skip: number, PageSize: number): Observable<RuleTotList> {
    return new Observable<RuleTotList>(observable => {

      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetTotExecRules`, requestOptions)
        .toPromise()
        .then(response => {
          observable.next(response.json());
          observable.complete();
        })
        .catch(error => {
          observable.error(error);
        });
    });
  }

}
