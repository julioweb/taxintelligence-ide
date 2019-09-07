import { Component, OnInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RuleService } from '../../services/data/rules/rule.service';
import { ServiceUtils } from '../../services/Utils/Utils';
import { DocumentsService } from '../../services/data/documents/documents.service';
import { NodesService } from '../../services/data/nodes/nodes.service';

import { DocumentModel, DocVersionModel } from '../../models/Documents';
import { RuleModel, RuleType, OperationType, RuleDetailModel, RuleDetailData, RulePlugin, TipoEstabelecimento, TipoSegmentoEstabelecimento, TipoTributacao, TipoRegimeEspecial } from '../../models/RuleTot';
import { ModalAlertComponent } from '../../modais/modal-alert/modal-alert.component';
import { BsModalService } from 'ngx-bootstrap';
import { NodeItem } from '../../models/Nodes';
import { SelectAllCheckboxState, PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import isBodyOffset from '@progress/kendo-popup-common/dist/es/is-body-offset';
import { FullLoadingComponent } from '../../modais/full-loading/full-loading.component';
import { CustomMethodsService } from '../../services/data/custom-methods/custom-methods.service';
import { ModalMethodComponent } from '../../modais/modal-method/modal-method.component';

@Component({
  selector: 'app-cad-rules',
  templateUrl: './cad-rules.component.html',
  styleUrls: ['./cad-rules.component.css']
})
export class CadRulesComponent implements OnInit, OnDestroy {

  hasName: boolean = true;
  hasType: boolean = true;
  hasOpType: boolean = true;
  hasDocVersion: boolean = true;
  hasDesc: boolean = true;
  hasValidationMsg: boolean = true;
  hasValidationCondition: boolean = true;
  hasValidationLevel: boolean = true;
  hasValidationDtInit: boolean = true;
  hasValidationDtFim: boolean = true;
  hasTransformNode: boolean = true;
  hasTransformVal: boolean = true;
  hasValidationFields: boolean = true;
  hasPlugin: boolean = true;

  hasTransformUrl:boolean = true;
  hasValidationUrl:boolean = true;

  isTransformacao: boolean = false;
  isPlugin: boolean = false;
  isValidation: boolean = false;

  bsUtils: ServiceUtils;
  ruleObjt: RuleModel;

  docRelId: string = '';
  docVersionId: string = '';

  fileUpload: File;

  contribiIpi:string = '';
  ipiFranca:string = '';
  ipiInsumos:string = '';
  opeEntGov:string = '';

  @ViewChild('ValNodeSel') validNodeSel: ElementRef;
  @ViewChild('ValCndtSel') validCndtSel: ElementRef;
  @ViewChild('ValRelacSel') validRelacSel: ElementRef;

  @ViewChild('RuleTypeSel') selRuleType: ElementRef;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  public selectValidAllState: string = 'unchecked';
  public selectedValidations: Array<string> = new Array<string>();
  
  curSubscribe: Subscription;
  _RelacDocsLst: Array<DocumentModel> = new Array<DocumentModel>();
  _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();
  _RuleTypeList: Array<RuleType> = new Array<RuleType>();
  _LstEstabelecimento: Array<TipoEstabelecimento> = new Array<TipoEstabelecimento>();
  _LstSegmentoEstab: Array<TipoSegmentoEstabelecimento> = new Array<TipoSegmentoEstabelecimento>();
  _LstRegimeEspecial:Array<TipoRegimeEspecial>= new Array<TipoRegimeEspecial>();
  _LstTipoTributacao: Array<TipoTributacao> = new Array<TipoTributacao>();
  _OperationTypeList: Array<OperationType> = new Array<OperationType>();
  _RelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();
  _AvaibleRelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();
  _PluginsList: Array<RulePlugin> = new Array<RulePlugin>();
  _SubscriptionID :Array<any>= new Array<any>();

  _ListValidation: Array<RuleDetailData> = new Array<RuleDetailData>();

  @Input() ruleEditId: string;
  inscricao: Subscription;

  public newValidation: RuleDetailData;
  public newTransformation: RuleDetailData;

  constructor(private bsRules: RuleService,
    public bsDocument: DocumentsService,
    public bsNode: NodesService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private bsCustomMethods: CustomMethodsService,
    private router: Router) {
    this.bsUtils = new ServiceUtils();
    this.ruleObjt = new RuleModel();

    this.ruleObjt.RuleID = this.bsUtils.GetNewGuidId();
    this.ruleObjt.TypeId = '';
    this.ruleObjt.OperationId = '';
    this.ruleObjt.DetailId = this.bsUtils.GetNewGuidId();
    this.ruleObjt.DocId = '';
    this.ruleObjt.VersionId = '';
    this.ruleObjt.RuleActive = true;
    this.ruleObjt.SubID = '';

    this.ruleObjt.Detail = new RuleDetailModel();
    this.ruleObjt.Detail.ConditionType = 0;
    this.ruleObjt.Detail.LevelType = 0;
    this.ruleObjt.Detail.PluginID = '';

    this.newValidation = new RuleDetailData();
    this.newValidation.ID = '';

    this.newTransformation = new RuleDetailData();
    this.newTransformation.ID = '';
    this.newTransformation.Order = 0;
    this.newTransformation.Type = 1;

    this.ruleObjt.Detail = new RuleDetailModel();

    this.bsDocument.GetDocumentsList(0, 1000).subscribe(a => {
      this._RelacDocsLst = a.Data;
    });

    this.bsRules.GetOperationTypes().subscribe(a => {
      this._OperationTypeList = a;
    });

    this.bsRules.GetRuleTypes().subscribe(a => {
      this._RuleTypeList = a;
    });

    this.bsRules.GetRulePlugins().subscribe(a => {
      this._PluginsList = a;
    });

    this.bsRules.GetEstabelecimentoType().subscribe(a => {
      this._LstEstabelecimento = a;
    });

    this.bsRules.GetSegmentoEstabelecimentoType().subscribe(a => {
      this._LstSegmentoEstab = a;
    });

    this.bsRules.GetTributacaoTypes().subscribe(a => {
      this._LstTipoTributacao = a;
    });

    this.bsRules.GetRegimeEspecialType().subscribe(a => {
      this._LstRegimeEspecial = a;
    });

    //TODO ISSO DEVE SER REVISTO
    this._SubscriptionID.push({ID: 'C56A1737-6076-4BA7-B006-C4F79E98F96E'.toLowerCase(), Text:'Atlantica'});
    this._SubscriptionID.push({ID: '86E367C8-D900-410E-BA73-D92C234C52CD'.toLowerCase(), Text:'Carrefour'});
    this._SubscriptionID.push({ID: 'fcb04a56-2a94-4618-bdd8-b6e6951779f5'.toLowerCase(), Text:'Onetech'});
    // this.ruleEditId = '0F2DE549-DE2C-58F8-C17B-689EF284731F'; // route.snapshot.params["Id"];
  }

  ngOnInit() {
    this.inscricao = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.ruleEditId = queryParams['id'];
      }
    );

    if (this.ruleEditId != null && this.ruleEditId != '') {
      this.LoadEditRule();
    }
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  FileUploaded(event){
    if(event.target.files.length>0)
    {
      this.fileUpload = event.target.files[0];
    }
    else
    {
      this.fileUpload = undefined;
    }
    
  }

  ChangeContribuinteIpi(){
     this.ipiFranca= '';
      this.ipiInsumos = '';

      if(this.contribiIpi !=""){
        this.ruleObjt.IndIPI = this.contribiIpi =="1";
      }
      else{
        this.ruleObjt.IndIPI = null;
      }
    if(!this.ruleObjt.IndIPI){
      this.ruleObjt.IpiFranca = null;
      this.ruleObjt.IpiInsumos = null;
    }
  }

  LoadEditRule() {
    this.bsRules.GetRuleById(this.ruleEditId).subscribe(a => {
      
      this.ruleObjt = a;
      if(this.ruleObjt.SubID == null){
        this.ruleObjt.SubID = '';
      }

      if(this.ruleObjt.IndIPI == null)
      {
        this.contribiIpi = "";
      }
      else
      {
        this.contribiIpi =  this.ruleObjt.IndIPI? "1":"0";
      }

      if(this.ruleObjt.IpiFranca == null)
      {
        this.ipiFranca = "";
      }
      else
      {
        this.ipiFranca =  this.ruleObjt.IpiFranca? "1":"0";
      }

      if(this.ruleObjt.IpiInsumos == null)
      {
        this.ipiInsumos = "";
      }
      else
      {
        this.ipiInsumos =  this.ruleObjt.IpiInsumos? "1":"0";
      }

      if(this.ruleObjt.OperEntGov == null)
      {
        this.opeEntGov = "";
      }
      else
      {
        this.opeEntGov =  this.ruleObjt.OperEntGov? "1":"0";
      }

     
      
      this.ruleObjt.Detail.InitValidity = a.Detail.InitValidity.split(' ')[0];
      this.ruleObjt.Detail.EndValiditiy = a.Detail.EndValiditiy.split(' ')[0];

      if (a.Detail.TransformRule.length > 0) {
        this.newTransformation = a.Detail.TransformRule[0];
        this.isTransformacao = true;
      }

      if (a.Detail.ValidationRule.length > 0) {
        this._ListValidation = a.Detail.ValidationRule;
        this.GridValidationReload();
      }

      if (a.Detail.PluginID != null && a.Detail.PluginID != '') {
        this.isPlugin = true;
      }

      this.GetVersionList(true);

    });
  }
  
  private IsInputValid() {
    let isValid = true;
    this.hasName = this.ruleObjt.Summary != null && this.ruleObjt.Summary.trim() != '';
    this.hasDesc = this.ruleObjt.RuleDescription != null && this.ruleObjt.RuleDescription.trim() != '';
    this.hasDocVersion = this.ruleObjt.VersionId != null && this.ruleObjt.VersionId.trim() != '';
    this.hasOpType = this.ruleObjt.OperationId != null && this.ruleObjt.OperationId.trim() != '';
    this.hasType = this.ruleObjt.TypeId != null && this.ruleObjt.TypeId.trim() != "";
    this.hasValidationMsg = this.ruleObjt.Detail.ValidationMsg != null && this.ruleObjt.Detail.ValidationMsg.trim() != '';
    this.hasValidationCondition = this.ruleObjt.Detail.ConditionType != null;
    this.hasValidationLevel = this.ruleObjt.Detail.LevelType != null;
    this.hasValidationDtFim = this.ruleObjt.Detail.EndValiditiy != null;
    this.hasValidationDtInit = this.ruleObjt.Detail.InitValidity != null;
    this.hasTransformNode = !this.isTransformacao || (this.newTransformation.NodeID != null && this.newTransformation.NodeID != '');
    this.hasTransformVal = !this.isTransformacao || (this.newTransformation.Value != null && this.newTransformation.Value != '');
    this.hasValidationFields = !this.isValidation || this._ListValidation.length > 0;
    this.hasPlugin = !this.isPlugin || (this.ruleObjt.Detail.PluginID != null && this.ruleObjt.Detail.PluginID != '');

    this.hasTransformUrl = !this.ruleObjt.Detail.IsUrlTransform || (this.ruleObjt.Detail.UrlTransformation != null && this.ruleObjt.Detail.UrlTransformation != "");
    this.hasValidationUrl = !this.ruleObjt.Detail.IsUrlValidation || (this.ruleObjt.Detail.UrlValidation != null && this.ruleObjt.Detail.UrlValidation != "");

    isValid = this.hasDesc && this.hasName && this.hasDocVersion && this.hasOpType && this.hasType && this.hasValidationCondition
      && this.hasValidationLevel && this.hasValidationDtFim && this.hasValidationDtInit && this.hasValidationMsg
      && this.hasTransformNode && this.hasTransformVal && this.hasValidationFields && this.hasPlugin && this.hasTransformUrl && this.hasValidationUrl;
    return isValid;
  }

  onSubmit(): void {
    if(this.fileUpload == undefined){
      let alertState = {
        Message: `Por favor adicione um arquivo de exemplo`,
        title: 'Arquivo Pendente',
        alertType: 'info'
      };
      this.modalService.show(ModalAlertComponent, { initialState: alertState });
    }
    else if (this.IsInputValid()) {
      
      this.fullLoading.showLoading();

      let isEdit = this.ruleEditId != null && this.ruleEditId != '';

      this.ruleObjt.IndIPI = this.contribiIpi == ""? null:this.contribiIpi == "1" ? true:false;
      this.ruleObjt.IpiInsumos = this.ipiInsumos == ""? null:this.ipiInsumos == "1" ? true:false;
      this.ruleObjt.IpiFranca = this.ipiFranca == ""? null:this.ipiFranca == "1" ? true:false;
      this.ruleObjt.OperEntGov = this.opeEntGov == ""? null:this.opeEntGov == "1" ? true:false;

      this.ruleObjt.Detail.ValidationRule = new Array<RuleDetailData>();
      this.ruleObjt.Detail.TransformRule = new Array<RuleDetailData>();

      this.ruleObjt.Detail.ValidationRule = this._ListValidation;

      if (this.isTransformacao) {
        if (!isEdit) {
          this.newTransformation.ID = this.bsUtils.GetNewGuidId();
          this.newTransformation.isNew = true;
        }
        else {
          this.newTransformation.isEdited = true;
        }

        this.ruleObjt.Detail.TransformRule.push(this.newTransformation);
      }

      if (!this.isPlugin) {
        this.ruleObjt.Detail.PluginID = "";
      }

      let formData: FormData = new FormData();
      formData.append("uploadFile", this.fileUpload, this.fileUpload.name);
      
      this.bsRules.SendRulePost(this.ruleObjt, isEdit,formData).subscribe(a => {
        let alertState = {
          Message: `O registro foi salvo com sucesso`,
          title: 'Alteração Efetuada!',
          alertType: 'success'
        };

        if (a != "OK") {
          alertState.title = 'Ops!!';
          if (a.indexOf('23 - ') == 0) {
            alertState.Message = a.replace('23 - ', '');
            alertState.alertType = 'info';
          }
          else {
            if (a == 'serverError' || a == 'ERRO') {
              alertState.Message = 'Ocorreu um erro ao tentar salvar o item, tente novamente mais tarde!';
            }
            else {
              alertState.Message = a;
            }
            alertState.alertType = 'danger';
          }
        }

        this.fullLoading.hideLoading();
        this.modalService.show(ModalAlertComponent, { initialState: alertState });
        if (a == 'OK') {
          this.router.navigate(['/rules']);
        }
      });
    }
  }

  OnSelRuleTypeChange() {
    let selText: string = this.selRuleType.nativeElement.selectedOptions[0].text;

    this.isTransformacao = selText.toLowerCase().trim() == 'transformação';
    this.isPlugin = selText.toLowerCase().trim() == 'Plugin';// selText.toLowerCase().trim() != 'transformação' && selText.toLowerCase().trim() != 'validação';
    this.isValidation = selText.toLowerCase().trim() != 'Plugin' && selText.toLowerCase().trim() != 'transformação' //== 'validação';
  }

  /*************************************Document******************************************/

  GetVersionList(isLoad: boolean) {
    this.bsDocument.GetDocVersionList(this.ruleObjt.DocId, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;

      if (isLoad) {
        this.GetVersionListNodes(isLoad);
      }
    });
  }

  GetVersionListNodes(isLoad: boolean) {
    this.bsNode.GetVersionNodes(this.ruleObjt.VersionId).subscribe(a => {
      this._RelacVersionNodList = a;
    });
  }

  /***************************************Regras de Validação*********************************************/
  public GridVData: GridDataResult = null;
  public GridVPageSize: number = 5;
  public GridVSkip: number = 0;

  public pageVChange(event: PageChangeEvent): void {
    this.GridVSkip = event.skip;
    this.GridValidationReload();
  }

  GridValidationReload() {
    this.GridVData = {
      data: this._ListValidation.slice(this.GridVSkip, this.GridVSkip + this.GridVPageSize),
      total: this._ListValidation.length
    }
  }

  IsValidationInputValid() {
    if(this.ruleObjt.Detail.IsUrlValidation)
    {
      return this.ruleObjt.Detail.UrlValidation != null && this.ruleObjt.Detail.UrlValidation.trim() != "" 
      && this.newValidation.NodeID != null && this.newValidation.NodeID != ''
      && this.newValidation.Value != null && this.newValidation.Value.trim() != ''
    }
    else{
      return this.newValidation.NodeID != null && this.newValidation.NodeID != ''
      && this.newValidation.Condition != null && this.newValidation.Condition != ''
      && this.newValidation.Relation != null && this.newValidation.Relation != '';
    }
    
  }

  onSelectAllVldChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      this.selectedValidations = this._ListValidation.map((item) => item.ID);
      this.selectValidAllState = 'checked';
    }
    else {
      this.selectedValidations = [];
      this.selectValidAllState = 'unchecked';
    }
  }

  private ClearValidationInput() {
    this.newValidation.Condition = '';
    this.newValidation.NodeID = '';
    this.newValidation.Relation = '';
    this.newValidation.Value = '';
    this.newValidation.ID = '';
  }

  private AddMethodToTable(editItem){
    let modalConfig = {
      keyboard: false,
      ignoreBackdropClick: true,
      modalService: this.modalService,
      initialState: {
        RelacVersionNodList: this._RelacVersionNodList,
        ItemOrder: this._ListValidation.length,
        ItemToEdit: editItem
      }
    };

    this.modalService.show(ModalMethodComponent, modalConfig);

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != undefined && result != "") {
        let methodValidattion = JSON.parse(result);
        
        var temp = this._ListValidation.find(x => x.ID == methodValidattion.ID);

        if (temp != null) {

          let idxUpdt = this._ListValidation.indexOf(temp);

          this._ListValidation[idxUpdt].Condition = methodValidattion.Condition;
          this._ListValidation[idxUpdt].ConditionDesc = methodValidattion.ConditionDesc;
          this._ListValidation[idxUpdt].Value = methodValidattion.Value;
          this._ListValidation[idxUpdt].ID = methodValidattion.ID;
          this._ListValidation[idxUpdt].Relation = methodValidattion.Relation;
          this._ListValidation[idxUpdt].RelationDesc = methodValidattion.RelationDesc;
          this._ListValidation[idxUpdt].NodeID = methodValidattion.NodeID;
          this._ListValidation[idxUpdt].NodeDesc = methodValidattion.NodeDesc;
          this._ListValidation[idxUpdt].MethodParams = methodValidattion.MethodParams;

          if (!this._ListValidation[idxUpdt].isNew)
            this._ListValidation[idxUpdt].isEdited = true;
        }
        else {
          this._ListValidation.push(methodValidattion);
        }
        this.GridValidationReload();
      }
      this.curSubscribe.unsubscribe();
    });
  }
  
  private AddValidationToTable() {
    let tmpValidation: RuleDetailData = {
      ID: this.bsUtils.GetNewGuidId(),
      Condition: this.newValidation.Condition,
      ConditionDesc:"",
      isNew: true,
      isMethod:false,
      isDeleted: false,
      isEdited: false,
      DetailID: "",
      NodeID: this.newValidation.NodeID,
      NodeDesc: this.validNodeSel.nativeElement.selectedOptions[0].text,
      Relation: this.newValidation.Relation,
      RelationDesc:""      ,
      Type: 0,
      Value: this.newValidation.Value == null ? "" : this.newValidation.Value,
      Order: this._ListValidation.length,
      MethodParams: []
    };

    if(!this.ruleObjt.Detail.IsUrlValidation){
      tmpValidation.ConditionDesc = this.validCndtSel.nativeElement.selectedOptions[0].text;
      tmpValidation.RelationDesc= this.validRelacSel.nativeElement.selectedOptions[0].text;

    }
    this._ListValidation.push(tmpValidation);

    if (this.selectValidAllState == 'checked') {
      this.selectedValidations.push(tmpValidation.ID);
    }

    this.ClearValidationInput();
    this.GridValidationReload();
  }

  private EditValidationItem(itemID: string) {
    var temp = this._ListValidation.find(x => x.ID == itemID);
    if (temp != null) {
      if(temp.isMethod){
        this.AddMethodToTable(temp);
      }
      else{
        this.newValidation.Condition = temp.Condition;
        this.newValidation.NodeID = temp.NodeID;
        this.newValidation.ID = temp.ID;
        this.newValidation.Relation = temp.Relation;
        this.newValidation.Value = temp.Value;
      }
    }
  }

  private UpdateValidationTable() {
    var temp = this._ListValidation.find(x => x.ID == this.newValidation.ID);

    if (temp != null) {

      let idxUpdt = this._ListValidation.indexOf(temp);

      this._ListValidation[idxUpdt].Condition = this.newValidation.Condition;
      this._ListValidation[idxUpdt].ConditionDesc = this.validCndtSel.nativeElement.selectedOptions[0].text;
      this._ListValidation[idxUpdt].Value = this.newValidation.Value;
      this._ListValidation[idxUpdt].ID = this.newValidation.ID;
      this._ListValidation[idxUpdt].Relation = this.newValidation.Relation;
      this._ListValidation[idxUpdt].RelationDesc = this.validRelacSel.nativeElement.selectedOptions[0].text;
      this._ListValidation[idxUpdt].NodeID = this.newValidation.NodeID;
      this._ListValidation[idxUpdt].NodeDesc = this.validNodeSel.nativeElement.selectedOptions[0].text;

      if (!this._ListValidation[idxUpdt].isNew)
        this._ListValidation[idxUpdt].isEdited = true;

      this.GridValidationReload();

      this.ClearValidationInput();
    }
  }

  private DeleteValidationTable() {

    if (this.selectValidAllState == 'checked') {
      let tmpArray: Array<RuleDetailData> = new Array<RuleDetailData>();

      for (var i = 0; i < this._ListValidation.length; i++) {
        this._ListValidation[i].isDeleted = true;
        if (!this._ListValidation[i].isNew) {
          tmpArray.push(this._ListValidation[i]);
        }
      }

      this._ListValidation = tmpArray;
    }
    else {

      for (var i = 0; i < this.selectedValidations.length; i++) {
        var temp = this._ListValidation.find(x => x.ID == this.selectedValidations[i]);

        if (temp != null) {
          let idxItm = this._ListValidation.indexOf(temp);
          this._ListValidation[idxItm].isDeleted = true;
          this._ListValidation.splice(idxItm, 1);
        }
      }
    }
    this.selectValidAllState = 'unchecked';
    this.GridValidationReload();
  }

  private CheckValidationUrlChange(){
    this.ruleObjt.Detail.IsUrlValidation = !this.ruleObjt.Detail.IsUrlValidation

    this._ListValidation = new Array<RuleDetailData>();
    this.ruleObjt.Detail.UrlValidation = null;
    this.GridValidationReload();
  }

  /***************************************Regras de Transformação*********************************************/
  private CheckTransformationUrlChange(){
    this.ruleObjt.Detail.IsUrlTransform = !this.ruleObjt.Detail.IsUrlTransform

    this.ruleObjt.Detail.UrlTransformation = null;
  }
}