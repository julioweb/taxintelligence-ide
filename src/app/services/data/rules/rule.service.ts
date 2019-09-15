import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder, Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { RuleTotList, RuleModelList, GroupRuleModelList, GroupRuleModel, RuleType, OperationType, RulePlugin, RuleModel, RuleProcessList,RuleProcess, TipoEstabelecimento, TipoSegmentoEstabelecimento, TipoTributacao, TipoRegimeEspecial } from "../../../models/RuleTot";
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

  GetRulePlugins(): Observable<Array<RulePlugin>> {
    return new Observable<Array<RulePlugin>>(observable => {

      var searchParams = {
        subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetRulePlugins`, requestOptions)
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

  GetEstabelecimentoType(): Observable<Array<TipoEstabelecimento>> {
    return new Observable<Array<TipoEstabelecimento>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetTipoEstabelecimento`, requestOptions)
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

  GetSegmentoEstabelecimentoType(): Observable<Array<TipoSegmentoEstabelecimento>> {
    return new Observable<Array<TipoSegmentoEstabelecimento>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetSegmentoEstabelecimento`, requestOptions)
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

  GetRegimeEspecialType(): Observable<Array<TipoRegimeEspecial>> {
    return new Observable<Array<TipoRegimeEspecial>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetRegimeEspecial`, requestOptions)
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

  GetTributacaoTypes(): Observable<Array<TipoTributacao>> {
    return new Observable<Array<TipoTributacao>>(observable => {

      var searchParams = {
        // subId: `${environment.subscriptionId}`,
        // skip: Skip,
        // take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetTipoTributacao`, requestOptions)
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
  SendNewRuleXlsToApi(xlsDoc:File,docid:string, versionid:string):Observable<any>{
    return new Observable<any>(observable => {
      let formData: FormData = new FormData();
      formData.append('uploadFile', xlsDoc, xlsDoc.name);
      formData.append('docid', docid);
      formData.append('versionid', versionid);
      let headers = new Headers()
      let requestOptions = new RequestOptions({ headers: headers }); 
      this.http.post(`${this._ruleSvcUrl}CreateRuleFromXls`,formData, requestOptions)
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

  SendRulePost(rule: RuleModel, isEdit: boolean, tmpFile: FormData) {
    let fileUpload = tmpFile;
    return new Observable<string>(observable => {
      var searchParams = {
        SubID: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        CreationUser: 'bruno.lima', //`${environment.userName}`
        RuleItem: rule,
        IsEdit: isEdit
      };

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      //requestOptions.headers = headers;
      //requestOptions = searchParams;
      var sendObj = {
        searchParams,tmpFile
      };

      tmpFile.append("ruleObj",JSON.stringify(searchParams));

      this.http.post(`${this._ruleSvcUrl}InsertUpdateRule`, tmpFile)
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

  GetRuleById(rulID: string): Observable<RuleModel> {
    return new Observable<RuleModel>(observable => {

      var searchParams = {
        //subId: `${environment.subscriptionId}`,
        ruleId: rulID
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}Get`, requestOptions)
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

  /******************************************Process Rules************************************************************/
  GetRuleProcessList(Skip: number, PageSize: number, prcID:string): Observable<RuleProcessList> {
    return new Observable<RuleProcessList>(observable => {
      var searchParams = {
        //subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize,
        prcID: prcID
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._ruleSvcUrl}GetExecProcessRule`, requestOptions)
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
