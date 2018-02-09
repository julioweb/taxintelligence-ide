import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs/Rx";
import { Headers, Http } from '@angular/http';

import{ KeyValue } from "../../../models/KeyValue";


@Injectable()
export class EmpresaService {

  constructor(private http: Http) { }
  GetList(): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

        if (!environment.MockBackEnd) {
            this.http.get(`${environment}/api/AAAA`)
                .toPromise()
                .then(response => {
                    observable.next(response.json().data as Array<KeyValue>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        }
        else {
            var vMock: Array<KeyValue> = [
                { Key: "1", Value: "Empresa 1" },
                { Key: "2", Value: "Empresa 2" },
                { Key: "3", Value: "Empresa 3" },
            ];

            observable.next(vMock);
            observable.complete();
        }
    });
  }

GetFiliais(EmpresaId: Array<string>): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

        if (!environment.MockBackEnd) {
            this.http.get(`${environment}/api/AAAA`)
                .toPromise()
                .then(response => {
                    observable.next(response.json().data as Array<KeyValue>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
        }
        else {
            var vMock: Array<KeyValue> = [
                { Key: "1", Value: "Filial 1" },
                { Key: "2", Value: "Filial 2" },
                { Key: "3", Value: "Filial 3" },
            ];

            observable.next(vMock);
            observable.complete();
        }
    });
  }
}
