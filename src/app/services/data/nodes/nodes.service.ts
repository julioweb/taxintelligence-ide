import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder, Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { ServiceUtils } from "../../Utils/Utils";
import { NodeType, NodeItem, NodeGroup } from "../../../models/Nodes";
import { KeyValue } from "../../../models/KeyValue";

@Injectable()
export class NodesService {

    private serviceUtils = new ServiceUtils();
    private _docmentSvcUrl: string = `${environment.UrlApiTaxIntelligence}Nodes/`;

    constructor(private http: Http, private authService: AuthService) { }

    GetNodeListType(): Observable<Array<NodeType>> {

        return new Observable<Array<NodeType>>(observable => {

            this.http.get(`${this._docmentSvcUrl}GetNodeTypeLst`,
                new RequestOptions({
                    headers: new Headers({ 'Accept': 'application/json' })
                }))
                .toPromise()
                .then(response => {
                    observable.next(response.json() as Array<NodeType>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        });
    }

    GetDocumentNodes(docID:string): Observable<Array<NodeItem>>{
        return new Observable<Array<NodeItem>>(observable => {
            var searchParams = {
                docId:docID
              };      
              let requestOptions = new RequestOptions();
              let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
              requestOptions.params = Parametros;
              requestOptions.headers = new Headers({ 'Accept': 'application/json' });

              this.http.get(`${this._docmentSvcUrl}GetDocumentNodes`,requestOptions)
                .toPromise()
                .then(response => {
                    observable.next(response.json() as Array<NodeItem>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        });
    }    

    GetVersionNodes(versionID:string): Observable<Array<NodeItem>>{
        return new Observable<Array<NodeItem>>(observable => {
            var searchParams = {
                versionId:versionID
              };      
              let requestOptions = new RequestOptions();
              let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
              requestOptions.params = Parametros;
              requestOptions.headers = new Headers({ 'Accept': 'application/json' });

              this.http.get(`${this._docmentSvcUrl}GetVersionNodes`,requestOptions)
                .toPromise()
                .then(response => {
                    observable.next(response.json() as Array<NodeItem>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        });
    }

    /*************************************************Node Group****************************************************/
    GetNodesGroup(docID:string): Observable<Array<NodeGroup>>{
        return new Observable<Array<NodeGroup>>(observable => {
            var searchParams = {
                docId:docID
              };      
              let requestOptions = new RequestOptions();
              let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
              requestOptions.params = Parametros;
              requestOptions.headers = new Headers({ 'Accept': 'application/json' });

              this.http.get(`${this._docmentSvcUrl}GetNodeGroup`,requestOptions)
                .toPromise()
                .then(response => {
                    observable.next(response.json() as Array<NodeGroup>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        });
    }

    SendNodeGroup(nodeDesc: NodeGroup, docID:string) {
        return new Observable<string>(observable => {      
          var searchParams = {
            ID: nodeDesc.ID,
            Name: nodeDesc.Name,
            DocID: docID
          };
    
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let requestOptions = new RequestOptions();
          requestOptions.headers = headers;
    
          this.http.post(`${this._docmentSvcUrl}AddNodeGroup`, searchParams, requestOptions)
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
