import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GridDataResult, PageChangeEvent, GridComponent } from '@progress/kendo-angular-grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';

import { DocumentsService } from "../../../services/data/documents/documents.service";

import { ModalVersionDocComponent } from "../../../modais/modal-version-doc/modal-version-doc.component";

import { NodeItem } from "../../../models/Nodes";
import { ServiceUtils } from '../../../services/Utils/Utils';
import { ModalAlertComponent } from '../../../modais/modal-alert/modal-alert.component';
import { DocVersionModel } from '../../../models/Documents';
import { FullLoadingComponent } from '../../../modais/full-loading/full-loading.component';


@Component({
  selector: 'grid-doc-version',
  templateUrl: './grid-doc-version.component.html',
  styleUrls: ['./grid-doc-version.component.css']
})
export class GridDocVersionComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;

  @Input('docPai') docIdPai: string;
  @Input('docPaiLevel') docPaiLevel: string;

  @Input() public category: Object;

  @Output('docVersionPhone') parentPhone: EventEmitter<String> = new EventEmitter<String>();
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  private serviceUtils: ServiceUtils;
  bsModalRef: BsModalRef;
  private curSubscribe: Subscription;

  private versionItem: DocVersionModel;
  ModalConfig = {
    keyboard: false,
    ignoreBackdropClick: true,
    initialState: null,
    class: "avl-modal-form"
  };

  private curVersionID: string;

  constructor(public docProcess: DocumentsService,
    private modalService: BsModalService) {
    this.serviceUtils = new ServiceUtils();
  }

  ngOnInit() {
    this.GridSkip = 0;
    this.GridReload();
  }

  /************************************************************************** Operações do Grid **************************************************************************/
  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.GridReload();
  }

  public GridReload() {
    this.docProcess.GetDocVersionList(this.docIdPai, this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
    });
  }

  /************************************************************************** Edição da Versão **************************************************************************/

  EditarVersao(versionItem: DocVersionModel) {
    this.versionItem = versionItem;
    this.RequestDocNode();
  }

  RequestDocNode() {
    this.parentPhone.emit(this.docIdPai);
  }

  public SetDocumentNod(nodeList: Array<NodeItem>) {
    this.OpenEditModal(nodeList);
  }

  OpenEditModal(nodeList: Array<NodeItem>) {
    let modalId = this.serviceUtils.GetNewGuidId();
    this.ModalConfig.initialState = {
      _nodeList: nodeList,
      curLevelType: this.docPaiLevel,
      newVersion: this.versionItem,
      ModalId: modalId
    };
    this.bsModalRef = this.modalService.show(ModalVersionDocComponent, this.ModalConfig);

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        var mdlResult = JSON.parse(result)

        if (mdlResult.Modal == "NewVersion" && mdlResult.ModalId == modalId) {
          if (mdlResult.Data != null) {
            mdlResult.Data.DocID = this.docIdPai;
            mdlResult.Data.isEdited = true;

            this.fullLoading.showLoading();
            this.docProcess.SendDocVersionPost(mdlResult.Data, true).subscribe(a => {
              this.fullLoading.hideLoading();
              let alertState = {
                Message: `Versão editada com sucesso.`,
                title: "Versão Editada!",
                alertType: "success"
              };

              if (a != "OK") {
                alertState.title = "Ops!!"
                if (a == "serverError" || a == "ERRO") {
                  alertState.Message = "Ocorreu um erro ao tentar editar a versão, tente novamente mais tarde!";
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

}
