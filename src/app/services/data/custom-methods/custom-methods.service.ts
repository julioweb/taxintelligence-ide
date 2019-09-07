import { Injectable, Optional } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions, URLSearchParams, QueryEncoder,Headers } from "@angular/http";
import { environment } from "../../../../environments/environment";

import { ServiceUtils } from "../../Utils/Utils";
import { AuthService } from "../../auth/auth.service";
import { CustomQueryModelList, CustomQueryModel } from '../../../models/CustomQueries';


@Injectable()
export class CustomMethodsService {

  private serviceUtils = new ServiceUtils();
  private _cmSvcUrl: string = `${environment.UrlApiTaxIntelligence}CustomQuery/`;

  constructor(private http: Http,
    private authService: AuthService) {
      //let item:CustomQueryModel
    }

    GetCustomQueriesList(Skip: number, PageSize: number): Observable<CustomQueryModelList> {
      return new Observable<CustomQueryModelList>(observable => {
  
        var searchParams = {
          //subId: `${environment.subscriptionId}`,
          skip: Skip,
          take: PageSize
        };
        let requestOptions = new RequestOptions();
        let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
        requestOptions.params = Parametros;
  
        this.http.get(`${this._cmSvcUrl}GetCustomQueriesList`, requestOptions)
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

    GetCustomQueryById(qID: string): Observable<CustomQueryModel> {
      return new Observable<CustomQueryModel>(observable => {
  
        var searchParams = {
          //subId: `${environment.subscriptionId}`,
          id: qID
        };
        let requestOptions = new RequestOptions();
        let Parametros = this.serviceUtils.ObjTOURLSearchParams(searchParams);
        requestOptions.params = Parametros;
  
        this.http.get(`${this._cmSvcUrl}Get`, requestOptions)
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

    SendCustomQueryPost(customQuery: CustomQueryModel, isEdit: boolean) {
      return new Observable<string>(observable => {
        var searchParams = {
          //Subid: `${environment.subscriptionId}`, //this.authService.SubscriptionId,
          CurUser: 'bruno.lima', //`${environment.userName}`
          CustomQueryItem: customQuery,
          IsEdit: isEdit
        };
  
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
  
        this.http.post(`${this._cmSvcUrl}InsertCustomQueries`, searchParams, requestOptions)
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
