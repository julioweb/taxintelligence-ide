import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentsService } from "../services/data/documents/documents.service";
import { ServiceUtils } from "../services/Utils/Utils";
import { Subscription } from 'rxjs/Subscription';
import { DocProcess } from '../models/Documents';

import { ModalAlertComponent } from "../modais/modal-alert/modal-alert.component";
import { ModalConfirmComponent } from "../modais/modal-confirm/modal-confirm.component";
import {ModalDocApvEditComponent} from "../modais/modal-doc-apv-edit/modal-doc-apv-edit.component"

import { RulesExecutedComponent } from '../rules-executed/rules-executed.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

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
  public svcUtils: ServiceUtils;

  bsModalRef: BsModalRef;
  private curSubscribe: Subscription;

  constructor(public bsDocument: DocumentsService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
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

  public AprovarItem() {
    const initialState = {
      Message: `Você tem certeza que deseja aprovar este item ?`,
      title: "Confirmar Aprovação",
      alertType: 'primary'
    };

    this.bsModalRef = this.modalService.show(ModalConfirmComponent, { initialState });

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        if (result == "true") {
          this.bsDocument.ApproveSingleItem(this.prcEditId).subscribe(a => {

            let alertState = {
              Message: `A aprovação foi efetuada com sucesso.`,
              title: "Aprovado!",
              alertType: "success"
            };

            if (a != "OK") {
              alertState.title = "Ops!!"
              if (a == "serverError" || a == "ERRO") {
                alertState.Message = "Ocorreu um erro ao tentar aprovar o item, tente novamente mais tarde!";
              }
              else {
                alertState.Message = a;
              }
              alertState.alertType = "danger";
            }

            this.modalService.show(ModalAlertComponent, { initialState: alertState });
            if(a == "OK")
            {
              window.location.reload();
            }            
          });
        }
      }
      this.curSubscribe.unsubscribe();
    });
  }

  public CanEditDocument(){
    return !this.prcObj.CanEditDoc;
  }

  public ShowModalEditDoc(){
    // let modalId = this.svcUtils.GetNewGuidId();

    // let modalConfig = {
    //   keyboard: false,
    //   ignoreBackdropClick: true,
    //   modalService: this.modalService,
    //   initialState:{
    //     ModalID: modalId,
    //     DocVersionId: this.prcObj.DocVersionID,
    //     IsMultiple:false,
    //     ProcessID: this.prcObj.ID
    //   }
    // };

    // this.bsModalRef = this.modalService.show(ModalDocApvEditComponent, modalConfig);     

    // this.curSubscribe = this.modalService.onHidden.subscribe(result => {
    //   if (result != null && result != "") {
    //     var mdlResult = JSON.parse(result);

    //     if(mdlResult.ModalId == modalId){
    //       //this.LoadNodeGroup(mdlResult.GrpID);
    //       this.curSubscribe.unsubscribe();
    //     }
    //   }
    // });
  }

}
