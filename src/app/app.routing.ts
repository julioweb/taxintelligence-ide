import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DocprcAprovacaoComponent } from './docprc-aprovacao/docprc-aprovacao.component';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentComponent } from './documents/create-document/add-document/add-document.component';

const APP_ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'doc-aprovacao', component: DocprcAprovacaoComponent },
    { path: 'documents', component: DocumentsComponent },
    { path: 'add-document', component: AddDocumentComponent },
    { path: '', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
