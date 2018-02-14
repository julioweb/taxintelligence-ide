import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder, Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { ServiceUtils } from "../../Utils/Utils";
import { NodeType, NodeItem } from "../../../models/Nodes";
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

}
