import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';

import { RuleService } from "../../services/data/rules/rule.service";
import { ServiceUtils } from "../../services/Utils/Utils"
import { DocumentsService } from '../../services/data/documents/documents.service';
import { NodesService } from "../../services/data/nodes/nodes.service"

import { DocumentModel, DocVersionModel } from '../../models/Documents';
import { RuleModel, RuleType, OperationType, RuleDetailModel, RuleDetailData } from "../../models/RuleTot";
import { ModalAlertComponent } from '../../modais/modal-alert/modal-alert.component';
import { BsModalService } from 'ngx-bootstrap';
import { NodeItem } from '../../models/Nodes';
import { SelectAllCheckboxState, PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-cad-rules',
  templateUrl: './cad-rules.component.html',
  styleUrls: ['./cad-rules.component.css']
})
export class CadRulesComponent implements OnInit {

  hasName: boolean = true;
  hasType: boolean = true;
  hasOpType: boolean = true;
  hasDocVersion: boolean = true;
  hasDesc: boolean = true;

  bsUtils: ServiceUtils;
  ruleObjt: RuleModel;

  docRelId: string;
  docVersionId: string;

  @ViewChild('ValNodeSel') validNodeSel: ElementRef;
  @ViewChild('ValCndtSel') validCndtSel: ElementRef;
  @ViewChild('ValRelacSel') validRelacSel: ElementRef;

  public selectValidAllState:string = "unchecked";
  public selectedValidations:Array<string> = new Array<string>();

  _RelacDocsLst: Array<DocumentModel> = new Array<DocumentModel>();
  _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();
  _RuleTypeList: Array<RuleType> = new Array<RuleType>();
  _OperationTypeList: Array<OperationType> = new Array<OperationType>();
  _RelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();
  _AvaibleRelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();

  _ListValidation:Array<RuleDetailData> = new Array<RuleDetailData>();

  @Input() ruleEditId: string;

  public newValidation:RuleDetailData;

  constructor(private bsRules: RuleService,
    public bsDocument: DocumentsService,
    public bsNode: NodesService,
    private modalService: BsModalService) {
    this.bsUtils = new ServiceUtils();
    this.ruleObjt = new RuleModel();

    this.ruleObjt.RuleID = this.bsUtils.GetNewGuidId();
    this.newValidation = new RuleDetailData();
    this.newValidation.ID = "";
    this.ruleObjt.Detail = new RuleDetailModel();
    //this.ruleEditId = "DDB2CF45-3EB4-4DBB-B230-0AD6180C91BA";//route.snapshot.params["Id"];
  }

  ngOnInit() {
    this.bsDocument.GetDocumentsList(0, 1000).subscribe(a => {
      this._RelacDocsLst = a.Data;
    });

    this.bsRules.GetOperationTypes().subscribe(a => {
      this._OperationTypeList = a;
    });

    this.bsRules.GetRuleTypes().subscribe(a => {
      this._RuleTypeList = a;
    });
  }

  private IsInputValid() {
    let isValid = true;
    this.hasName = this.ruleObjt.Summary != null && this.ruleObjt.Summary.trim() != "";
    this.hasDesc = this.ruleObjt.RuleDescription != null && this.ruleObjt.RuleDescription.trim() != "";
    this.hasDocVersion = this.docVersionId != null && this.docVersionId.trim() != "";
    this.hasOpType = this.ruleObjt.OperationId != null && this.ruleObjt.OperationId.trim() != "";
    this.hasType = this.ruleObjt.TypeId != null && this.ruleObjt.TypeId.trim() != "";
    isValid = this.hasDesc && this.hasName && this.hasDocVersion && this.hasOpType && this.hasType;
    return isValid;
  }

  onSubmit(): void {
    if (this.IsInputValid()) {
      debugger;
    }
  }

  /*************************************Document******************************************/
  GetVersionList(isLoad: boolean) {
    this.bsDocument.GetDocVersionList(this.docRelId, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;
    });
  }

  GetVersionListNodes(isLoad: boolean) {
    this.bsNode.GetVersionNodes(this.docVersionId).subscribe(a => {
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

  GridValidationReload(){
    this.GridVData = {
      data: this._ListValidation.slice(this.GridVSkip, this.GridVSkip + this.GridVPageSize),
      total: this._ListValidation.length
    }
  }
  
  IsValidationInputValid(){
    return this.newValidation.NodeID != null && this.newValidation.NodeID != ""
           && this.newValidation.Condition != null && this.newValidation.Condition != ""
           && this.newValidation.Relation != null && this.newValidation.Relation != "";
  }

  onSelectAllVldChange(checkedState: SelectAllCheckboxState){
    if (checkedState === 'checked') {
      this.selectedValidations = this._ListValidation.map((item) => item.ID);
      this.selectValidAllState = 'checked';
    }
    else {
      this.selectedValidations = [];
      this.selectValidAllState = 'unchecked';
    }
  }

  private ClearValidationInput(){
    this.newValidation.Condition= "";
    this.newValidation.NodeID= "";
    this.newValidation.Relation= "";
    this.newValidation.Value= "";
    this.newValidation.ID = "";
  }

  private AddValidationToTable(){
    let tmpValidation:RuleDetailData = {
      ID: this.bsUtils.GetNewGuidId(),
      Condition: this.newValidation.Condition,
      ConditionDesc: this.validCndtSel.nativeElement.selectedOptions[0].text,
      isNew:true,
      isDeleted:false,
      isEdited:false,
      DetailID:"",
      NodeID: this.newValidation.NodeID,
      NodeDesc: this.validNodeSel.nativeElement.selectedOptions[0].text,
      Relation: this.newValidation.Relation,
      RelationDesc: this.validRelacSel.nativeElement.selectedOptions[0].text,
      Type: 0,
      Value: this.newValidation.Value == null? "": this.newValidation.Value
    };

    this._ListValidation.push(tmpValidation);

    if(this.selectValidAllState == 'checked'){
      this.selectedValidations.push(tmpValidation.ID);
    }

    this.ClearValidationInput();
    this.GridValidationReload();
  }

  private EditValidationItem(itemID:string){
    var temp = this._ListValidation.find(x=> x.ID == itemID);
    if(temp != null){
      this.newValidation.Condition = temp.Condition;
      this.newValidation.NodeID = temp.NodeID;
      this.newValidation.ID = temp.ID;
      this.newValidation.Relation = temp.Relation;
      this.newValidation.Value = temp.Value;
    }
  }

  private UpdateValidationTable(){
    var temp = this._ListValidation.find(x=> x.ID == this.newValidation.ID);
    
    if(temp != null){

      let idxUpdt = this._ListValidation.indexOf(temp);
      
      this._ListValidation[idxUpdt].Condition = this.newValidation.Condition;
      this._ListValidation[idxUpdt].ConditionDesc = this.validCndtSel.nativeElement.selectedOptions[0].text;
      this._ListValidation[idxUpdt].Value = this.newValidation.Value;
      this._ListValidation[idxUpdt].ID = this.newValidation.ID;
      this._ListValidation[idxUpdt].Relation = this.newValidation.Relation;
      this._ListValidation[idxUpdt].RelationDesc = this.validRelacSel.nativeElement.selectedOptions[0].text;
      this._ListValidation[idxUpdt].NodeID = this.newValidation.NodeID;
      this._ListValidation[idxUpdt].NodeDesc = this.validNodeSel.nativeElement.selectedOptions[0].text;

      if(!this._ListValidation[idxUpdt].isNew)
            this._ListValidation[idxUpdt].isEdited = true;

      this.GridValidationReload();

      this.ClearValidationInput();
    }
  }

  private DeleteValidationTable(){
    
    if(this.selectValidAllState == 'checked'){
       let tmpArray:Array<RuleDetailData> = new Array<RuleDetailData>();

       for(var i = 0; i< this._ListValidation.length; i++)
       {
         this._ListValidation[i].isDeleted = true;
         if(!this._ListValidation[i].isNew){
           tmpArray.push(this._ListValidation[i]);
         }
       }

       this._ListValidation = tmpArray;
    }
    else{
      
      for(var i = 0; i< this.selectedValidations.length; i++){        
        var temp = this._ListValidation.find(x=> x.ID == this.selectedValidations[i]);
    
        if(temp != null){
          let idxItm = this._ListValidation.indexOf(temp);
          this._ListValidation[idxItm].isDeleted = true;
          this._ListValidation.splice(idxItm,1);
        }
      }
    }
    this.selectValidAllState = "unchecked";
    this.GridValidationReload();
  }

}
