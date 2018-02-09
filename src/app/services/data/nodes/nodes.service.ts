import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder,Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { AuthService } from "../../auth/auth.service";
import { ServiceUtils } from "../../Utils/Utils";
import { NodeType } from "../../../models/Nodes";
import { KeyValue } from "../../../models/KeyValue";

@Injectable()
export class NodesService {

  private serviceUtils = new ServiceUtils();
  private _docmentSvcUrl:string = `${environment.UrlApiTaxIntelligence}Nodes/`;

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

}
