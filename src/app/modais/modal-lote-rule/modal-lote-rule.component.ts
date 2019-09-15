import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentModel, DocVersionModel } from '../../models/Documents';
import { DocumentsService } from '../../services/data/documents/documents.service';
import { ServiceUtils } from '../../services/Utils/Utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FullLoadingComponent } from '../full-loading/full-loading.component';
import { RuleService } from '../../services/data/rules/rule.service';

@Component({
  selector: 'app-modal-lote-rule',
  templateUrl: './modal-lote-rule.component.html',
  styleUrls: ['./modal-lote-rule.component.css']
})
export class ModalLoteRuleComponent implements OnInit {

  fileUpload: File;
  curSubscribe: Subscription;
  _RelacDocsLst: Array<DocumentModel> = new Array<DocumentModel>();
  _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();
  
  bsUtils: ServiceUtils;

  DocId:string;
  VersionId:string;
  hasDocVersion:boolean = true;
  hasFile:boolean = true;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  constructor(public bsDocument: DocumentsService,
    private bsRules: RuleService,
    public bsModalRef: BsModalRef,
    public bsModalService: BsModalService) { 
    this.bsUtils = new ServiceUtils();
    this.bsDocument.GetDocumentsList(0, 1000).subscribe(a => {
      this._RelacDocsLst = a.Data;
    });
  }

  ngOnInit() {
  }

  FileUploaded(event){
    if(event.target.files.length>0)
    {
      this.fileUpload = event.target.files[0];
      if (!this.fileUpload.name.endsWith("xlsx") && !this.fileUpload.name.endsWith("xlx")){
        this.fileUpload = undefined;
        this.hasFile = false;
      }
      else{
        this.hasFile = true;
      }
    }
    else
    {
      this.fileUpload = undefined;
    }
  }

  GetVersionList() {
    this.bsDocument.GetDocVersionList(this.DocId, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;
    });
  }

  onConfirm():void{
    this.hasDocVersion = this.VersionId != undefined && this.VersionId != "";
    this.hasFile = this.fileUpload != undefined;
    if(this.hasFile && this.hasDocVersion){
      this.fullLoading.showLoading();
      this.bsRules.SendNewRuleXlsToApi(this.fileUpload, this.DocId, this.VersionId).subscribe(a => {
        this.fullLoading.hideLoading();
        if (a.Status) {
          this.bsModalService.setDismissReason('');
          this.bsModalRef.hide();
        }
        else {
          let alertState = {
            Message: "Deu um erro no servidor",
            title: "Opsss!!! ¬¬",
            alertType: "danger"
          };

          if(a != undefined)
          {
            alertState.Message = a.Message;
          }
          this.bsModalService.setDismissReason(JSON.stringify(alertState));
          this.bsModalRef.hide();
        }
      }, err => {
        let alertState = {
          Message: "Não foi possível, pegamos um erro não tratado!",
          title: "Opsss!!! ¬¬",
          alertType: "danger"
        };
        this.bsModalService.setDismissReason(JSON.stringify(alertState));
        this.bsModalRef.hide();
        this.fullLoading.hideLoading();
      });
    }
  }

}
