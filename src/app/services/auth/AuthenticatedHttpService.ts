import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from "../../../environments/environment";


@Injectable()
export class AuthenticatedHttpService extends Http {

    constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);

        let vToken = localStorage.getItem("Token");
        if (vToken != null && vToken != "")
            defaultOptions.headers.append('Authorization', `Bearer ${vToken}`);        
    }

    private RegexUrlDominio = /http[s]{0,1}:\/\/([^\/]+)/g;

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

        let vUrl = (typeof (url) == "string" ? url : (url as Request).url);

        if (AuthenticatedHttpService.UrlEqual(environment.UrlApiTaxIntelligence, vUrl)) {
            let vToken = localStorage.getItem("Token");
            if (vToken != null && vToken != "") {
                if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
                    if (!options) {
                        // let's make option object
                        options = { headers: new Headers() };
                    }
                    options.headers.set('Authorization', `Bearer ${vToken}`);
                } else {
                    // we have to add the token to the url object
                    url.headers.set('Authorization', `Bearer ${vToken}`);
                }
            }
        }

        return super.request(url, options).catch((error: Response) => {

            if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
                if (AuthenticatedHttpService.UrlEqual(environment.UrlApiTaxIntelligence, error.url)) {
                    console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
                    //window.location.href = window.location.href + '?' + new Date().getMilliseconds();
                    window.location.href = "/Login";
                }
            }
            return Observable.throw(error);
        });
    }

    private static UrlEqual(Url1: string, Url2: string): boolean
    {
        let RegexResultUrlApp = (/(http[s]{0,1}:){0,1}\/\/([^\/]+)/g).exec(Url1);
        let RegexResultErrorUrl = (/(http[s]{0,1}:){0,1}\/\/([^\/]+)/g).exec(Url2);

        if (!(RegexResultUrlApp.length >= 3 && RegexResultErrorUrl.length >= 3))
            return;

        return RegexResultUrlApp[2] == RegexResultErrorUrl[2];
    }
}
