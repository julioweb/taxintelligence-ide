import { Injectable, Optional } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder,Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { FiltrosTelaAprovacaoStorage,FiltrosTelaAprovacaoTools } from "../../../services/business/aprovacao/FiltrosGridAprovacao";
import { ServiceUtils } from "../../Utils/Utils";
import{ DocBriefList, DocProcessList,DocPostObject, DocumentList,DocVersionList, DocumentModel, DocVersionModel, DocProcess, DocPrcEditData, DocPrcEditNode } from "../../../models/Documents";
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

  GetDocProcessByID(prcID:string): Observable<DocProcess> {

    return new Observable<DocProcess>(observable => {

      var searchParams = {
        subId: `${environment.subscriptionId}`,
        id: prcID
      };

      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

        this.http.get(`${this._docmentSvcUrl}GetDocProcess`,requestOptions)
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

  GetDocProcessEditData(versionID:string,prcID:string, isMultiple:boolean): Observable<Array<DocPrcEditData>>{
    return new Observable<Array<DocPrcEditData>>(observable => {

      var searchParams = {
        versionID:versionID,
        isMultiple: isMultiple,
        PrcID:prcID
      };

      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

        this.http.get(`${this._docmentSvcUrl}GetDocProcessEditData`,requestOptions)
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

  SendDocProcessEditData(version:string, lstPrc:Array<string>,lstNodes:Array<DocPrcEditNode>){
    return new Observable<string>(observable => {
      var searchParams = {
        subID: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        versionID: version,
        lstPrcs: lstPrc,
        lstEditNodes:lstNodes
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}EditProcessDocument`,searchParams, requestOptions)
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
  /*****************************************************Home Index************************************************************** */
  ReprocessDocument(tdpID: string): Observable<string>{
    return new Observable<string>(observable => {
      
      var searchParams = {
        subID: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        tdpID: tdpID
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}ReprocessDocument`,searchParams, requestOptions)
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

  SendDocPost(docPost:DocPostObject, isEdit:boolean):Observable<string>{
    return new Observable<string>(observable => {
      var searchParams = {
        //Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        DocPost: docPost,
        IsEdit: isEdit
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}InsertUpdateDocument`,searchParams, requestOptions)
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

  SendNewDocXlsToApi(xlsDoc:File):Observable<any>{
    return new Observable<any>(observable => {
      let formData: FormData = new FormData();  
      formData.append('uploadFile', xlsDoc, xlsDoc.name);  
      let headers = new Headers()
      let requestOptions = new RequestOptions({ headers: headers }); 
      this.http.post(`${this._docmentSvcUrl}CreateDocumentFromXls`,formData, requestOptions)
      //this.http.post(`http://localhost:5200/api/Documents/CreateDocumentFromXls`,formData, requestOptions)
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
  
  GetDocListByLevelType(levelID: number):Observable<Array<DocumentModel>>{
    return new Observable<Array<DocumentModel>>(observable=> {
      var searchParams = {
        levelType: levelID
      };
      
      let requestOptions = new RequestOptions();
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = headers;

      this.http.get(`${this._docmentSvcUrl}GetAvaibleRelacDocList`,requestOptions)
            .toPromise()
            .then(response => {
                observable.next(response.json() as Array<DocumentModel>);
                observable.complete();
            })
            .catch(error => {
                observable.error(error);
            });
    });
  }

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

  GetDocumentsList(Skip: number, PageSize:number, docLevel?:number): Observable<DocumentList>{
    return new Observable<DocumentList>(observable => {
      
      var searchParams = {
        subId: `${environment.subscriptionId}`,
        skip: Skip,
        take: PageSize,
        docLevel: docLevel
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

  GetDocumentById(Id:string): Observable<DocumentModel>{
    return new Observable<DocumentModel>(observable => {
      var searchParams = {
        id: Id
      }; 
           
      let requestOptions = new RequestOptions();
      let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
      requestOptions.params = Parametros;
      requestOptions.headers = new Headers({ 'Accept': 'application/json' });

      this.http.get(`${this._docmentSvcUrl}Get`, requestOptions)
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

  SendDocVersionPost(version:DocVersionModel, isEdit:boolean){
    return new Observable<string>(observable => {
      var searchParams = {
        //Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
        Version: version,
        isEdit: isEdit
      };
      
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let requestOptions = new RequestOptions();
      requestOptions.headers = headers;

      this.http.post(`${this._docmentSvcUrl}InsertUpdateDocVersion`,searchParams, requestOptions)
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
}
