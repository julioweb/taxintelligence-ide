import { Component, OnInit } from '@angular/core';
import { CustomMethodsService } from '../../services/data/custom-methods/custom-methods.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NodeItem } from '../../models/Nodes';
import { CustomQueryModel } from '../../models/CustomQueries';
import { RuleDetailData } from '../../models/RuleTot';
import { hasFilterMenu } from '@progress/kendo-angular-grid/dist/es/filtering/filterable';
import { ServiceUtils } from '../../services/Utils/Utils';

@Component({
  selector: 'app-modal-method',
  templateUrl: './modal-method.component.html',
  styleUrls: ['./modal-method.component.css']
})
export class ModalMethodComponent implements OnInit {

  RelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();
  _MethodsList:Array<CustomQueryModel> = new Array<CustomQueryModel>();
  finalObjt:any;
  ItemOrder:number;
  ItemToEdit:RuleDetailData;

  hasMethod:boolean = true;
  hasAllParams:boolean =true;
  isEdit:boolean = false;

  bsUtils: ServiceUtils;
  
  constructor(
    private bsCustomMethods: CustomMethodsService,
    public bsModalRef: BsModalRef,
    public bsModalService: BsModalService
    //public nodeService: NodesService
  ) { 
    this.bsUtils = new ServiceUtils();
    this.finalObjt = {};
  }

  ngOnInit() {
    this.finalObjt = {};
    this.isEdit = this.ItemToEdit != undefined;
    if(this.ItemToEdit){
      this.finalObjt.MethodID = this.ItemToEdit.NodeID;
      this.finalObjt.MethodName = this.ItemToEdit.NodeDesc;
      this.finalObjt.Params = this.ItemToEdit.MethodParams.map((x)=>{return {NodeID:x}});
    }
    this.LoadCustomMethods();

  }

  validateFields():boolean{
    this.hasMethod = this.finalObjt.MethodID != undefined && this.finalObjt.MethodID != "";
    this.hasAllParams = this.finalObjt.Params.length > 0 && this.finalObjt.Params.find(x=> x.NodeID == undefined || x.NodeID == "") == undefined;
    return this.hasAllParams && this.hasMethod;
  }

  onConfirm(): void {
    if(this.validateFields()){
      let hresult:RuleDetailData = {
        ID: this.bsUtils.GetNewGuidId(),
        Condition: "",
        ConditionDesc:"",
        isNew: true,
        isMethod:true,
        isDeleted: false,
        isEdited: false,
        DetailID: "",
        NodeID: this.finalObjt.MethodID,
        NodeDesc: this.finalObjt.MethodName,
        Relation: "AND",
        RelationDesc:"E",
        Type: 0,
        Value: "",
        Order: this.ItemOrder,
        MethodParams: this.finalObjt.Params.map((x)=>{return x.NodeID})
      };
      if(this.ItemToEdit){
        hresult.ID = this.ItemToEdit.ID;
        hresult.isNew = this.ItemToEdit.isNew;
      }
      this.bsModalService.setDismissReason(JSON.stringify(hresult));
      this.bsModalRef.hide();
    }
  }

  public LoadCustomMethods() {
    this.bsCustomMethods.GetCustomQueriesList(0, 200).subscribe(a => {
      this._MethodsList = a.Data;

      if(this.ItemToEdit){
        let methodDesc = this._MethodsList.find(x=> x.ID == this.ItemToEdit.NodeID);
        this.finalObjt.MethDesc = methodDesc.Desc;
      }
    });
  }

  OnMethodChange($event){
    if(this.finalObjt.MethodID == undefined || this.finalObjt.MethodID == ""){
      this.hasMethod = false;
      this.finalObjt.MethDesc = "";
      this.finalObjt.MethodName = "";
      this.finalObjt.Params = [];
    }
    else{
      this.hasMethod = true;
      
      let curObjtMethod = this._MethodsList.find(x=> x.ID == this.finalObjt.MethodID);

      this.finalObjt.MethodName = $event.currentTarget.selectedOptions[0].innerText;
      this.finalObjt.MethDesc =  curObjtMethod.Desc;
      this.finalObjt.Params = [];
      for(var i= 0; i < curObjtMethod.TotParams; i++){
        this.finalObjt.Params.push({
          NodeID:""
        });
      }
    }
  }

}
