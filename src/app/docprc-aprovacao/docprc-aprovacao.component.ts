import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { GridDataResult, PageChangeEvent, RowArgs } from '@progress/kendo-angular-grid';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LocalStorage, SessionStorage, LocalStorageService } from 'ngx-webstorage';
import { debug } from 'util';
import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DocProcessList, DocProcess, DocumentModel, DocVersionModel } from "../models/Documents";
import { DocumentsService } from "../services/data/documents/documents.service";
import { UsersService } from "../services/data/users/users.service";
import { EmpresaService } from  "../services/data/empresas/empresa.service";
import { ServiceUtils } from  "../services/Utils/Utils";
import { ModalAlertComponent } from "../modais/modal-alert/modal-alert.component";
import { ModalConfirmComponent } from "../modais/modal-confirm/modal-confirm.component";
import { ModalApproveDocComponent } from "../modais/modal-approve-doc/modal-approve-doc.component";
import { FiltrosTelaAprovacaoStorage, FiltrosTelaAprovacaoHabilitadoStorage } from "../services/business/aprovacao/FiltrosGridAprovacao";
import { KeyValue } from "../models/KeyValue";
import { Router } from '@angular/router';
import { ModalDocApvEditComponent } from '../modais/modal-doc-apv-edit/modal-doc-apv-edit.component';

import { FullLoadingComponent } from '../modais/full-loading/full-loading.component';

@Component({
  selector: 'app-docprc-aprovacao',
  templateUrl: './docprc-aprovacao.component.html',
  styleUrls: ['./docprc-aprovacao.component.css'],
  providers: [FiltrosTelaAprovacaoStorage, FiltrosTelaAprovacaoHabilitadoStorage,ServiceUtils]
})
export class DocprcAprovacaoComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;
  private curSubscribe: Subscription;
  bsModalRef: BsModalRef;
  public EmpresaData: Array<KeyValue> = null;
  public FilialData: Array<KeyValue> = null;
  public StatusData: Array<KeyValue> = null;
  public StatusDocumentoData: Array<KeyValue> = null;
  public AprovadorData: Array<KeyValue> = null;
  public CNPJDATA: Array<KeyValue> = null;

  public _DocFilterList:Array<DocumentModel> = new Array<DocumentModel>();
  public selectedProcess:Array<string> = new Array<string>();
  public _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();

  @ViewChild('filterDocument') selDocFilter: ElementRef;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  public canEditDoc:boolean = false;

  constructor(public docProcess: DocumentsService,
    private modalService: BsModalService,
    public Filtros: FiltrosTelaAprovacaoStorage,
    public filtrosHabilitados: FiltrosTelaAprovacaoHabilitadoStorage,
    private storage: LocalStorageService,
    private userService:UsersService,
    private svcUtils: ServiceUtils,
    private empresaService: EmpresaService,
    private router: Router  ) {

      this.Filtros.VersionID = "";
      docProcess.GetDocProcessStatusTypeList().subscribe(a => {
            this.StatusData = a;
      });

      docProcess.GetDocStatusType().subscribe(a => {
            this.StatusDocumentoData = a;
      });

      userService.GetList().subscribe(a => {
        this.AprovadorData = a;
      });

      empresaService.GetList().subscribe(a => {
            this.EmpresaData = a;
      });

      docProcess.GetDocProcessCNPJs().subscribe(a => {
        this.CNPJDATA = a;
      });

      docProcess.GetUsuarioAprovador().subscribe(a => {
        this.AprovadorData = a;
      });

      this.GridSkip = 0;

      docProcess.GetDocumentsList(0,800,0).subscribe(a=> {
        this._DocFilterList = a.Data;
        if(this._DocFilterList.length > 0){
          this.Filtros.DocID = this._DocFilterList[0].ID;
        }
        this.GridReload();
      })
      
  }

  ngOnInit() { }

  FormatCnpjItem(item:string)
  {
    return this.svcUtils.ConvertStringToCNPJ(item);
  }

  GetVersionList(item){
    this.docProcess.GetDocVersionList(this.Filtros.DocID, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;
      if(this._DocFilterList.length > 0){
        this.Filtros.VersionID = this._RelacDocVersionLst[0].ID;
      }
    });
  }

  /************************************************************************** Operações do Filtro **************************************************************************/

  public LimpaFiltros(): void {
    this.Filtros.Clear();
    this.GridReload();    
  }

  public CarregaFiliais() {
    if (this.Filtros != null)
      this.EmpresaMudou(this.Filtros.Empresa);
  }

  public EmpresaMudou(Empresa: Array<KeyValue>) {
    if (Empresa != null && Empresa.length > 0) {
      this.empresaService.GetFiliais(Empresa.map(a => a.Key)).subscribe(a => {
        this.FilialData = a;
      });
    }
    else {
      this.FilialData = null;
      this.Filtros.Filial = null;
    }
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
    let curFiltros = this.Filtros;
    this.selectedProcess = [];
    this.docProcess.GetExecDocumentProcess(this.GridSkip, this.GridPageSize,this.Filtros).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
      
      let doc = this.selDocFilter;
      this.canEditDoc = false;

      if(doc.nativeElement.selectedOptions[0].getAttribute("data-canedit") == "true" && a.Data.length > 0){
        this.canEditDoc = true;
      }
    });
  }

  public mySelectionKey(context) {
    
    let tmpSelitem = this.GridData.data.filter(x=> context.indexOf(x.ID) >= 0);

    let letEditDoc = true
    for(var i =0; i< tmpSelitem.length; i++){
      if(letEditDoc && tmpSelitem[i].Status != 2 &&  tmpSelitem[i].Status != 3){
        letEditDoc = false;
      }
    }
    this.canEditDoc = letEditDoc
}

  VisualizarProcesso(itemID){
    this.router.navigate(
      ['/doc-process'],
      {
        queryParams: {
          'id': itemID
        }
      }
    );
  }

  /************************************************************************** Aprovação dos Itens **************************************************************************/
  public AprovarItem(event: PageChangeEvent, item: DocProcess) {
    const initialState = {
      Message: `Você tem certeza que deseja aprovar nota: "<strong>${item.DocumentID}</strong>" ?`,
      title: "Confirmar Aprovação",
      alertType: 'primary'
    };

    this.bsModalRef = this.modalService.show(ModalConfirmComponent, { initialState });

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        if (result == "true") {
          this.fullLoading.showLoading();
          this.docProcess.ApproveSingleItem(item.ID).subscribe(a => {
            this.fullLoading.hideLoading();
            
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
            this.GridReload();
          });
        }
      }
      this.curSubscribe.unsubscribe();
    });
  }

  public AprovarTudo(event: PageChangeEvent) {
    const initialState = {
      Message: `Você tem certeza que deseja aprovar todas as notas pendentes?`,
      title: "Confirmar Aprovação em Lote",
      alertType: 'primary'
    };

    this.bsModalRef = this.modalService.show(ModalConfirmComponent, { initialState });

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        if (result == "true") {
          this.fullLoading.showLoading();
          this.docProcess.ApproveAllPendentItems().subscribe(a => {
            this.fullLoading.hideLoading();
            let alertState = {
              Message: `A aprovação foi efetuada com sucesso.`,
              title: "Aprovado!",
              alertType: "success"
            };

            if (a != "OK") {
              alertState.title = "Ops!!"
              if (a.indexOf("23 - ") == 0) {
                alertState.Message = a.replace("23 - ", "");
                alertState.alertType = "info";
              }
              else {
                if (a == "serverError" || a == "ERRO") {
                  alertState.Message = "Ocorreu um erro ao tentar aprovar o item, tente novamente mais tarde!";
                }
                else {
                  alertState.Message = a;
                }
                alertState.alertType = "danger";
              }
            }

            this.modalService.show(ModalAlertComponent, { initialState: alertState });
            this.GridReload();
          });
        }
      }
      this.curSubscribe.unsubscribe();
    });
  }  

  /************************************************************************** Edição de documento **************************************************************************/

  public CanEditDocument(){
    return !this.canEditDoc;
  }

  public ShowModalEditDoc(){
    
    if(this.selectedProcess != null && this.selectedProcess.length > 0 && this.Filtros.VersionID != null && this.Filtros.VersionID != ""){
      let modalId = this.svcUtils.GetNewGuidId();

      let modalConfig = {
        keyboard: false,
        ignoreBackdropClick: true,
        modalService: this.modalService,
        initialState:{
          ModalID: modalId,
          DocVersionId: this.Filtros.VersionID,
          IsMultiple:true,
          lstProcessID: this.selectedProcess
        },
        class: "avl-modal-form"
      };
  
      this.bsModalRef = this.modalService.show(ModalDocApvEditComponent, modalConfig);     
  
      this.curSubscribe = this.modalService.onHidden.subscribe(result => {
        if (result != null && result != "") {
          var mdlResult = JSON.parse(result);
  
          if(mdlResult.ModalId == modalId){
            
            if(mdlResult.Result == "OK"){
              this.selectedProcess = [];
              this.GridReload();
            }
            this.curSubscribe.unsubscribe();
          }
        }
      });
    }  
    else{
      let alertState = {
        Message: '',
        title: "Atenção!",
        alertType: "warning"
      };

      if (this.selectedProcess != null || this.selectedProcess.length <= 0) {
        alertState.Message = "Necessário selecionar ao menos um documento para edição!";
      }
      else if(this.Filtros.VersionID != null || this.Filtros.VersionID != ""){
        alertState.Message = "Necessário selecionar uma versão de documento";
      }

      this.modalService.show(ModalAlertComponent, { initialState: alertState });
    }  
  }
}
