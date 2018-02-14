import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder, Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { RuleTotList, RuleModelList, GroupRuleModelList, GroupRuleModel, RuleType, OperationType } from "../../../models/RuleTot";
import { ServiceUtils } from "../../Utils/Utils";



@Injectable()
export class RuleService {

  private serviceUtils = new ServiceUtils();
  private _ruleSvcUrl: string = `${environment.UrlApiTaxIntelligence}Rules/`;
  private _groupRuleSvcUrl: string = `${environment.UrlApiTaxIntelligence}RuleGroup/`;

  constructor(private http: Http,
    private authService: AuthService) { }


  /******************************************Tipos************************************************************/
  GetRuleTypes(): Observable<Array<RuleType>> {
    return new Observable<Array<RuleType>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetTypes`, requestOptions)
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

  GetOperationTypes(): Observable<Array<OperationType>> {
    return new Observable<Array<OperationType>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetOperationTypes`, requestOptions)
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
  /******************************************Rules************************************************************/
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

  GetRulesList(Skip: number, PageSize: number): Observable<RuleModelList> {
    return new Observable<RuleModelList>(observable => {

      var searchParams = {
        //subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetRulesList`, requestOptions)
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

  /******************************************GroupRules************************************************************/
  GetGroupRuleList(Skip: number, PageSize: number): Observable<GroupRuleModelList> {
    return new Observable<GroupRuleModelList>(observable => {

      var searchParams = {
        //subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._groupRuleSvcUrl}GetRuleGroupList`, requestOptions)
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

  SendRuleGroupPost(ruleGroup: GroupRuleModel, isEdit: boolean) {
    return new Observable<string>(observable => {
      var searchParams = {
        //Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        CurUser: 'bruno.lima', //`${environment.userName}`
        Group: ruleGroup,
        IsEdit: isEdit
      };

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._groupRuleSvcUrl}InsertUpdateRuleGroup`, searchParams, requestOptions)
        .toPromise()
        .then(response => {
          observable.next(response.json());
          observable.complete();
        })
        .catch(error => {
          observable.next('serverError');
          observable.complete();
        });
    });
  }

  GetGroupRuleById(grpID: string): Observable<GroupRuleModel> {
    return new Observable<GroupRuleModel>(observable => {

      var searchParams = {
        //subId: `${environment.subscriptionId}`,
        id: grpID
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._groupRuleSvcUrl}Get`, requestOptions)
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
