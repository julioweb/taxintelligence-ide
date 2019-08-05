import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
// import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';

import { DocumentsService } from "../services/data/documents/documents.service";
import { NodesService } from "../services/data/nodes/nodes.service";

import { ModalVersionDocComponent } from "../modais/modal-version-doc/modal-version-doc.component";
import { GridDocVersionComponent } from "../dashboard/grid-doc-version/grid-doc-version/grid-doc-version.component";

// import { DocProcessList, DocProcess } from "../models/Documents";
import { NodeItem } from "../models/Nodes";
import { ServiceUtils } from '../services/Utils/Utils';
import { ModalAlertComponent } from '../modais/modal-alert/modal-alert.component';
import { FullLoadingComponent } from '../modais/full-loading/full-loading.component';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  @ViewChild('docVersion') docVersion: GridDocVersionComponent;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;
  @ViewChild('xlsNewDocument') xlsNewDocument:ElementRef;
  
  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;

  private serviceUtils: ServiceUtils;
  bsModalRef: BsModalRef;
  private curSubscribe: Subscription;

  private curSelDocId: string;
  private curSelDocLevel: string;

  ModalConfig = {
    keyboard: false,
    ignoreBackdropClick: true,
    initialState: null,
    class: "avl-modal-form"
  };

  NodesInCache = [];

  public SendToChild: boolean = false;

  constructor(public docProcess: DocumentsService,
    public nodeService: NodesService,
    private modalService: BsModalService,
    private router: Router) {
    this.serviceUtils = new ServiceUtils();
    this.GridSkip = 0;
    this.GridReload();
  }

  ngOnInit() {}

  /************************************************************************** Operações do Grid **************************************************************************/
  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.GridReload();
  }

  public GridReload() {
    this.docProcess.GetDocumentsList(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      };
    });
  }

  AddGridVersao(itemID: string, levelDoc: string) {
    this.curSelDocId = itemID;
    this.curSelDocLevel = levelDoc;

    let tmpCache = this.NodesInCache.find(x => x.ID == this.curSelDocId);
    if (tmpCache != null) {
      this.OpenAddModal(tmpCache.Data);
    }
    else {
      this.GetDocumentNodes(this.curSelDocId);
    }
  }

  GetDocumentNodes(tmpDocId: string) {
    this.nodeService.GetDocumentNodes(tmpDocId).subscribe(a => {
      this.NodesInCache.push({
        ID: tmpDocId,
        Data: a
      });
      if (this.SendToChild) {
        this.SendToChild = false;
        this.docVersion.SetDocumentNod(a);
      }
      else {
        this.OpenAddModal(a);
      }
    });
  }

  OpenAddModal(nodeList: Array<NodeItem>) {
    let modalId = this.serviceUtils.GetNewGuidId();
    this.ModalConfig.initialState = {
      _nodeList: nodeList,
      curLevelType: this.curSelDocLevel,
      ModalId: modalId
    };
    this.bsModalRef = this.modalService.show(ModalVersionDocComponent, this.ModalConfig);

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        var mdlResult = JSON.parse(result)
        if (mdlResult.Modal == "NewVersion" && mdlResult.ModalId == modalId) {
          if (mdlResult.Data != null) {
            mdlResult.Data.DocID = this.curSelDocId;
            mdlResult.Data.isNew = true;
            mdlResult.Data.ID = this.serviceUtils.GetNewGuidId();

            this.fullLoading.showLoading();
            this.docProcess.SendDocVersionPost(mdlResult.Data, false).subscribe(a => {
              this.fullLoading.hideLoading();
              let alertState = {
                Message: `Versão adicionada com sucesso.`,
                title: "Versão Criada!",
                alertType: "success"
              };

              if (a != "OK") {
                alertState.title = "Ops!!"
                if (a == "serverError" || a == "ERRO") {
                  alertState.Message = "Ocorreu um erro ao tentar adicionar a versão, tente novamente mais tarde!";
                }
                else {
                  alertState.Message = a;
                }
                alertState.alertType = "danger";
              }

              this.modalService.show(ModalAlertComponent, { initialState: alertState });
              this.GridReload();
            });
          }
          this.curSubscribe.unsubscribe();
        }
      }
    });
  }

  VersionChildCalling($event) {
    let tmpCache = this.NodesInCache.find(x => x.ID == $event);
    if (tmpCache != null) {
      this.docVersion.SetDocumentNod(tmpCache.Data);
    }
    else {
      this.SendToChild = true;
      this.GetDocumentNodes($event);
    }
  }

  AddNewDocument() {
    this.router.navigate(['/add-document']);
  }

  AddFromXls(){
    let event = new MouseEvent('click', {bubbles: false});
    this.xlsNewDocument.nativeElement.dispatchEvent(event);
  }

  NewDocXlsSelected(event: any) {
    if (event.target.files != null && event.target.files.length > 0) {
      this.fullLoading.showLoading();
      let file: File = event.target.files[0];
      if (file.name.endsWith("xlsx") || file.name.endsWith("xlx")) {
        this.docProcess.SendNewDocXlsToApi(file).subscribe(a => {
          if (a.Status) {
            this.AtualizaGrid();
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
            this.modalService.show(ModalAlertComponent, { initialState: alertState });
          }

          this.fullLoading.hideLoading();
        }, err => {
          let alertState = {
            Message: "Não foi possível, pegamos um erro não tratado!",
            title: "Opsss!!! ¬¬",
            alertType: "danger"
          };
          this.modalService.show(ModalAlertComponent, { initialState: alertState });
          this.fullLoading.hideLoading();
        });
      }
      else{
        let alertState = {
          Message: "Arquivo não suportado, selecione .xlx,.xlsx",
          title: "Aí não né !!!",
          alertType: "info"
        };
        this.modalService.show(ModalAlertComponent, { initialState: alertState });
        this.fullLoading.hideLoading();
      }
    }
  }

  EditarItem(id) {
    this.router.navigate(
      ['/edit-document'],
      {
        queryParams: {
          'id': id
        }
      }
    );
  }
}
