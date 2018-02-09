import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder,Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { FiltrosTelaAprovacaoStorage,FiltrosTelaAprovacaoTools } from "../../../services/business/aprovacao/FiltrosGridAprovacao";
import { ServiceUtils } from "../../Utils/Utils";
import{ DocBriefList, DocProcessList, DocumentList,DocVersionList } from "../../../models/Documents";
import { KeyValue } from "../../../models/KeyValue";

@Injectable()
export class DocumentsService {

  private serviceUtils = new ServiceUtils();
  private _docmentSvcUrl:string = `${environment.UrlApiTaxIntelligence}Documents/`;
  private filtroGridTool:FiltrosTelaAprovacaoTools = new FiltrosTelaAprovacaoTools();
  constructor(private http: Http, private authService: AuthService) { }


  /*****************************************************Document Process************************************************************** */
   GetDocProcessStatusTypeList(): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

        this.http.get(`${this._docmentSvcUrl}GetProcessStatusTypes`,
            new RequestOptions({
              headers: new Headers({ 'Accept': 'application/json' })
            }))
            .toPromise()
            .then(response => {
                observable.next(response.json().map(a => { return { Key: a.Id, Value: a.Type } }) as Array<KeyValue>);
                observable.complete();
            })
            .catch(error => {
                observable.error(error);
            });
    });
  }

  GetDocStatusType(): Observable<Array<KeyValue>> {

        return new Observable<Array<KeyValue>>(observable => {

            this.http.get(`${this._docmentSvcUrl}GetDocStatusTypes`,
                new RequestOptions({
                    headers: new Headers({ 'Accept': 'application/json' })
                }))
                .toPromise()
                .then(response => {
                    observable.next(response.json().map(a => { return { Key: a.Id, Value: a.Type } }) as Array<KeyValue>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        });
  }

  GetUsuarioAprovador(): Observable<Array<KeyValue>>{
    return new Observable<Array<KeyValue>>(observable => {
      
      var searchParams = {
        subId: `${environment.subscriptionId}`
      };

      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

        this.http.get(`${this._docmentSvcUrl}GetApprovalUsersList`,requestOptions)
            .toPromise()
            .then(response => {
                //let vData = response.json() as Array<{ approvalUser: string }>;

                observable.next(response.json().map(a => { return { Key: a, Value: a } }) as Array<KeyValue>);
                observable.complete();
            })
            .catch(error => {
                observable.error(error);
            });
    });
  }

  GetDocProcessCNPJs(): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

      var searchParams = {
        subId: `${environment.subscriptionId}`
      };

      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

        this.http.get(`${this._docmentSvcUrl}GetDocProcessCnpj`,requestOptions)
            .toPromise()
            .then(response => {
                observable.next(response.json().map(a => { return { Key: a, Value: this.serviceUtils.ConvertStringToCNPJ(a) } }) as Array<KeyValue>);
                observable.complete();
            })
            .catch(error => {
                observable.error(error);
            });
    });
  }  

  GetExecDocumentProcess(Skip: number, PageSize:number,Filtros:FiltrosTelaAprovacaoStorage): Observable<DocProcessList>{
    return new Observable<DocProcessList>(observable => {
      
      var curFiltro = this.filtroGridTool.GetFiltroObject(Filtros);
      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize,
        filtros: JSON.stringify(curFiltro)
      };      
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

      this.http.get(`${this._docmentSvcUrl}GetGridPrcList`, requestOptions)
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

  /*****************************************************Home Index************************************************************** */
  GetDocProcessBrief(Skip: number, PageSize: number): Observable<DocBriefList>{
    return new Observable<DocBriefList>(observable => {
      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize
      };
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;

      this.http.get(`${this._docmentSvcUrl}GetBriefDocProcess`, requestOptions)
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

  /*****************************************************Aprovação************************************************************** */
  ApproveSingleItem(docID: string): Observable<string>{
    return new Observable<string>(observable => {
      
      var searchParams = {
        Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        DocID: docID,
        UserName: `${environment.userName}`,//this.authService.UserName
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}ApproveSingleDocProcess`,searchParams, requestOptions)
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

  ApproveAllPendentItems(): Observable<string>{
    return new Observable<string>(observable => {
      
      var searchParams = {
        Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        UserName: `${environment.userName}`,//this.authService.UserName
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}ApproveAllDocProcess`,searchParams, requestOptions)
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

  /*****************************************************Document************************************************************** */

  GetDocLevelType(): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

        this.http.get(`${this._docmentSvcUrl}GetDocLevelType`,
            new RequestOptions({
                headers: new Headers({ 'Accept': 'application/json' })
            }))
            .toPromise()
            .then(response => {
                observable.next(response.json().map(a => { return { Key: a.Id, Value: a.Type } }) as Array<KeyValue>);
                observable.complete();
            })
            .catch(error => {
                observable.error(error);
            });
    });
}

  GetDocumentsList(Skip: number, PageSize:number): Observable<DocumentList>{
    return new Observable<DocumentList>(observable => {
      
      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize
      };      
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

      this.http.get(`${this._docmentSvcUrl}GetDocList`, requestOptions)
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


  /*****************************************************Document Version***************************************************************/

  GetDocVersionList(DocId:string, Skip: number, PageSize:number): Observable<DocVersionList>{
    return new Observable<DocVersionList>(observable => {
      
      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize,
        docId:DocId
      };      
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

      this.http.get(`${this._docmentSvcUrl}GetDocVersionList`, requestOptions)
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
