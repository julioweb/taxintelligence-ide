import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentsService } from "../services/data/documents/documents.service";
import { ServiceUtils } from "../services/Utils/Utils";
import { Subscription } from 'rxjs/Subscription';
import { DocProcess } from '../models/Documents';
import { RulesExecutedComponent } from '../rules-executed/rules-executed.component';

@Component({
  selector: 'document-process',
  templateUrl: './document-process.component.html',
  styleUrls: ['./document-process.component.css']
})
export class DocumentProcessComponent implements OnInit, OnDestroy {

  @ViewChild('execRules') executedRules: RulesExecutedComponent;
  @Input() prcEditId: string;
  inscricao: Subscription;

  prcObj: DocProcess;
  public svcUtils: ServiceUtils

  constructor(public bsDocument: DocumentsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.prcObj = new DocProcess();
    this.svcUtils = new ServiceUtils();
  }

  ngOnInit() {
    this.inscricao = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.prcEditId = queryParams['id'];
      }
    );

    if (this.prcEditId != null && this.prcEditId != "") {
      this.LoadProcess();
    }
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  LoadProcess() {
    this.bsDocument.GetDocProcessByID(this.prcEditId).subscribe(a => {

      this.prcObj = a;
      this.executedRules.SetProcessID(this.prcEditId);
      if (a.CompetenceDate != null) {
        this.prcObj.CompetenceDate = a.CompetenceDate.split(' ')[0];
      }
      if (a.DtInit != null) {
        this.prcObj.DtInit = a.DtInit.split(' ')[0];
      }
      if (a.DtFim != null) {
        this.prcObj.DtFim = a.DtFim.split(' ')[0];
      }
      if (a.ApprovalDate != null) {
        this.prcObj.ApprovalDate = a.ApprovalDate.split(' ')[0];
      }


      let descStatusNf = "";
      switch (this.prcObj.DocumentStatus.toString()) {
        case "0": descStatusNf = ""; break;
        case "1": descStatusNf = "Autorizado"; break;
        case "2": descStatusNf = "Cancelado"; break;
        case "3": descStatusNf = "Denegado"; break;
      }
      this.prcObj.DocumentStatus = descStatusNf;
      if (this.prcObj.CNPJ != null && this.prcObj.CNPJ != "") {
        this.prcObj.CNPJ = this.FormatCnpjItem(this.prcObj.CNPJ);
      }
    });
  }

  hasUrl(type: string){
    let hresult = false;

    if(type == "xml"){
      hresult = this.prcObj.UrlXml != null && this.prcObj.UrlXml != "";
    }
    else if(type == "json"){
      hresult = this.prcObj.UrlJson != null && this.prcObj.UrlJson != ""
    }
    return hresult;
  }

  DownloadItem(type: string) {
    let urlDownload = "";

    if(type == "xml"){
      urlDownload = this.prcObj.UrlXml;
    }
    else if(type == "json"){
      urlDownload = this.prcObj.UrlJson;
    }

    if (urlDownload != null && urlDownload != "") {
      var link = document.createElement("a");
      link.download = "a";
      link.href = urlDownload;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

  }

  FormatCnpjItem(item: string) {
    return this.svcUtils.ConvertStringToCNPJ(item);
  }

}
