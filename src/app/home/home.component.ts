import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from "@angular/router";
import { LocalStorage, SessionStorage, LocalStorageService } from 'ngx-webstorage';

import { environment } from '../../environments/environment'
import { DashBoardRender, TokenType_TOKENPORTALOLD, TokenType_OAUTH } from "../ExternalComponents/DashBoardRender";
import { AuthService } from "../services/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {

  private _tabIdxActive: number = 0;
  constructor(private authService: AuthService) { }

  private DashBoard1: any;  

  ngOnInit() {
    this.DashBoard1 = DashBoardRender({
      Id: 'DashBoard1',
      DashBoardGuidId: 'B55525CB-869D-4927-97B1-6AADA88192D6',
      TokenType: TokenType_OAUTH,
      Token: this.authService.Token,
      AppId: environment.Auth_AppId //'E52A9D2E-C8A6-4AE6-8965-045780E9FCE3'
    });
  }
}