import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs/Rx";
import { Headers, Http } from '@angular/http';

import{ KeyValue } from "../../../models/KeyValue";

@Injectable()
export class UsersService {

  constructor(private http: Http) { }
  public GetList(): Observable<Array<KeyValue>> {

    return new Observable<Array<KeyValue>>(observable => {

        if (!environment.MockBackEnd) {
            /*
            this.http.get(`${environment}/api/AAAA`)
                .toPromise()
                .then(response => {
                    observable.next(response.json().data as Array<KeyValue>);
                    observable.complete();
                })
                .catch(error => {
                    observable.error(error);
                });
            */
        }
        else {
            var vMock: Array<KeyValue> = [
                { Key: "1", Value: "Usuario 1" },
                { Key: "2", Value: "Usuario 2" },
                { Key: "3", Value: "Usuario 3" },
            ];

            observable.next(vMock);
            observable.complete();
        }
    });
}
}
