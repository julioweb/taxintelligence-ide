//ANGULAR IMPORTS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';


// KENDO PLUGINS 
// import { ChartModule } from '@progress/kendo-angular-charts';
import { GridModule, ExcelModule  } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// import { LayoutModule } from '@progress/kendo-angular-layout';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';



// NGX PLUGINS 
import { ModalModule } from 'ngx-bootstrap';

// AVALARA COMPONENTS
import { AppComponent } from './app.component';
import { AuthenticatedHttpService } from "./services/auth/AuthenticatedHttpService";
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GridRulesComponent } from './dashboard/grid-rules/grid-rules.component';

// AVALARA SERVICES
import { AuthService } from "./services/auth/auth.service";
import { DocumentsService } from "./services/data/documents/documents.service";
import { RuleService } from "./services/data/rules/rule.service";
import { GridDocumentsComponent } from './dashboard/grid-documents/grid-documents.component';
import { MyCurrencyPipe } from './pipe/Currency/my-currency.pipe';
import { DocprcAprovacaoComponent } from './docprc-aprovacao/docprc-aprovacao.component';
import { ModalAlertComponent } from './modais/modal-alert/modal-alert.component';
import { ModalConfirmComponent } from './modais/modal-confirm/modal-confirm.component';
import { ModalApproveDocComponent } from './modais/modal-approve-doc/modal-approve-doc.component';
import { UsersService } from "./services/data/users/users.service";
import { EmpresaService } from  "./services/data/empresas/empresa.service";
import { NodesService } from  "./services/data/nodes/nodes.service";
import { DocumentsComponent } from './documents/documents.component';
import { GridDocVersionComponent } from './dashboard/grid-doc-version/grid-doc-version/grid-doc-version.component';
import { AddDocumentComponent } from './documents/create-document/add-document/add-document.component';
import { NodesComponent } from './nodes/nodes.component';
import { DocumentVersionComponent } from './document-version/document-version.component';
import { ModalVersionDocComponent } from './modais/modal-version-doc/modal-version-doc.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GridRulesComponent,
    GridDocumentsComponent,
    MyCurrencyPipe,
    DocprcAprovacaoComponent ,
    ModalAlertComponent,
    ModalConfirmComponent,
    ModalApproveDocComponent,
    DocumentsComponent,
    GridDocVersionComponent,
    AddDocumentComponent,
    NodesComponent,
    DocumentVersionComponent,
    ModalVersionDocComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
//    routing,
    Ng2Webstorage,
    //NGX MODAL
    ModalModule.forRoot(),
    // kendo MOdule
    BrowserAnimationsModule,
    ButtonsModule,
    // ChartModule,
    GridModule,
    ExcelModule ,
    // LayoutModule,
    DatePickerModule,
    DropDownsModule,
    IntlModule
  ],
  providers: [
    AuthService,
    { provide: Http, useClass: AuthenticatedHttpService },
    DocumentsService,
    RuleService,
    UsersService,
    EmpresaService,
    NodesService
  ],
  entryComponents: [
    ModalAlertComponent,
    ModalConfirmComponent,
    ModalApproveDocComponent,
    ModalVersionDocComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
