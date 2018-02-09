import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment";
import { LocalStorage, SessionStorage, LocalStorageService } from 'ngx-webstorage';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class AuthService {  
  constructor(
      private http: Http
      ) {

  }


  get Autenticado(): boolean {
      return this.Token != "" && this.Token != null && this.UserName != null && this.UserName != "";
  }

  ///TODO: Passar estes parametros para o environments

  get SubscriptionId(): string {
    return localStorage.getItem("SubscriptionId");
  }
  set SubscriptionId(value: string) {
    localStorage.setItem('SubscriptionId', value);
  }


  get UserName(): string {
      return localStorage.getItem("UserName");
  }
  set UserName(value: string) {
      localStorage.setItem('UserName', value);
  }

  get UserAdmin(): boolean {
      return localStorage.getItem("UserAdmin")==="true";
  }
  set UserAdmin(value: boolean) {
      localStorage.setItem('UserAdmin', value.toString());
  }

  private ValidouToken: boolean = false;
  get Token(): string {
      let vToken = localStorage.getItem("Token");
      if (!this.ValidouToken && (vToken != null && vToken != "")) {
          this.ValidaToken(vToken).subscribe();
          this.ValidouToken = true;
      }
      return vToken;
  }
  set Token(value: string) {
      localStorage.setItem('Token', value);
      if (value != null && value != "")
          this.ValidaTokenCurrencyAutoRedirect();
  }

  public Login(Usuario: string, Senha: string): Observable<AuthService> {
      return new Observable<AuthService>(observable => {
          var vLoginTO = {
              grant_type: "password",
              UserName: Usuario,
              Password: Senha,
              client_id: `${environment.Auth_AppId}@${environment.Auth_Token}`
          };

          
          this.http.post(
              `${environment.UrlAuth}/token`,
              //JSON.stringify(vLoginTO),
              this.ObjTOURLSearchParams(vLoginTO).toString(),
              new RequestOptions({
                  headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
              }))
              .toPromise()
              .then(response => {
                  let vLoginReturn = response.json();
                  this.TrataRetornoLogin(vLoginReturn);

                  observable.next(this);
                  observable.complete();
              })
              .catch(error => {
                  console.error('An error occurred', error);
                  this.Token = null;
                  observable.error(error);
              });
      });
  }

  public LoginByToken(TokenPortal: string): Observable<AuthService> {
      return this.Login(TokenPortal, "");
  }

  private ObjTOURLSearchParams(obj): URLSearchParams {
      let params: URLSearchParams = new URLSearchParams();
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
              var element = obj[key];

              params.set(key, element);
          }
      }
      return params;
  }

  public ValidaTokenCurrencyAutoRedirect() {
      if (this.Autenticado && (this.Token != null && this.Token != "")) {
          this.ValidaToken(this.Token).subscribe(a => {
              if (!a.Autenticado)
                  '';//this.router.navigate(['/Login']);
          });
      }
  }

  public ValidaToken(vToken: string): Observable<AuthService> {

      return new Observable<AuthService>(observable => {
      });
  }

  private TrataRetornoLogin(vLoginReturn): void {

      let vToken = vLoginReturn.access_token;
      this.UserName = vLoginReturn.userName;
      this.SubscriptionId = vLoginReturn.SubId;

      this.UserAdmin = this.UserName == "adm.keeptrueprojeto" || this.UserName == "adm.produto";

      if (vToken)
          this.Token = vToken;
      else
          this.Token = null;
  }

  public Logout(): void {
      localStorage.removeItem('Token');
      '';//this.router.navigate(['/Login']);
  }
}
