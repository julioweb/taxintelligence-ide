import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DocprcAprovacaoComponent } from './docprc-aprovacao/docprc-aprovacao.component';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentComponent } from './documents/create-document/add-document/add-document.component';
import { RulesComponent } from './rules/rules.component';
import { CadRulesComponent } from './rules/cad-rules/cad-rules.component';
import { RuleGroupComponent } from './rule-group/rule-group.component';
import { CadRuleGroupComponent } from './rule-group/cad-rule-group/cad-rule-group.component';
import {DocumentProcessComponent} from "./document-process/document-process.component";
import { CustomMethodsComponent } from './custom-methods/custom-methods.component';
import { CadCustomMethodsComponent } from './custom-methods/cad-custom-methods/cad-custom-methods.component';

const APP_ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'doc-aprovacao', component: DocprcAprovacaoComponent },
    { path: 'documents', component: DocumentsComponent },
    { path: 'add-document', component: AddDocumentComponent },
    { path: 'edit-document', component: AddDocumentComponent },
    { path: 'rules', component: RulesComponent },
    { path: 'add-rule', component: CadRulesComponent },
    { path: 'edit-rule', component: CadRulesComponent },
    { path: 'rules-group', component: RuleGroupComponent },
    { path: 'add-rule-group', component: CadRuleGroupComponent },
    { path: 'edit-rule-group', component: CadRuleGroupComponent },
    { path: 'custom-method', component: CustomMethodsComponent },
    { path: 'add-custom-method', component: CadCustomMethodsComponent },
    { path: 'edit-custom-method', component: CadCustomMethodsComponent },
    {path: 'doc-process', component:DocumentProcessComponent},
    { path: '', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
