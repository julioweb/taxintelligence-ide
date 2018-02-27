import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';

import { ServiceUtils } from "../services/Utils/Utils";
import { NodesService } from "../services/data/nodes/nodes.service";

import { NodeType, NodeItem, NodeGroup } from "../models/Nodes";
import { KeyValue } from "../models/KeyValue";
import { ModalNodeGroupComponent } from '../modais/modal-node-group/modal-node-group.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {

  newNode = {
    Name: "",
    Label: "",
    Xpath: "",
    Type: "",
    ID: "",
    ParentID: "",
    isEditable: false,
    groupID: ""
  }

  nodeList: Array<NodeItem>;

  curSubscribe: Subscription;

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;
  private serviceUtils: ServiceUtils;
  public selectAllState: SelectAllCheckboxState = 'unchecked';

  public selectedNodes: string[] = [];

  public _NodePaiList: Array<any> = new Array();
  public _NodePaiListBKP: Array<any> = new Array();
  
  public _NodeGroupList: Array<NodeGroup> = new Array<NodeGroup>();

  @ViewChild('typeSel') selectedtype: ElementRef;
  @ViewChild('parentSel') selectedParent: ElementRef;
  @ViewChild('nodeGroupSel') selectedNodgroup: ElementRef;

  public NodesType: Array<NodeType> = new Array<NodeType>();

  bsModalRef: BsModalRef;

  @Input('docID') documentID: string = "";

  constructor(private nodService: NodesService,
    public _bsModalService: BsModalService) {

    this.serviceUtils = new ServiceUtils();

    nodService.GetNodeListType().subscribe(a => {
      this.NodesType = a;
    });

    this.nodeList = new Array<NodeItem>();
  }  

  ngOnInit() {
    this.LoadNodeGroup("");
  }

  public SetDocumentID(docParent:string){
    this.documentID = docParent;
    this.LoadNodeGroup("");

  }
  
  public LoadNodeGroup(selGroup:string){
    
    
    if(this.newNode.ID != null && this.newNode.ID != ""){
      this.newNode.groupID = selGroup;
    }

    if(this.documentID != ""){
      this.nodService.GetNodesGroup(this.documentID).subscribe(a=> {
        this._NodeGroupList = a;
      });
    }
    
  }

  public RetrieveNodeList() {
    return this.nodeList;
  }

  public LoadNodesFromServe(docParentID: string) {
    this.nodService.GetDocumentNodes(docParentID).subscribe(a => {
      this.nodeList = a;
      this.GridReload();

      var lstListas = this.nodeList.filter(x=> x.TypeDesc.toLowerCase() == "lista");

      for(var b = 0; b < lstListas.length; b++){
        this._NodePaiList.push({ ID: lstListas[b].ID, DESC: lstListas[b].Label });
      }
    });
  }

  /*******************************************Grid**********************************************/
  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }
  public GridReload() {
    this.GridData = {
      data: this.nodeList.slice(this.GridSkip, this.GridSkip + this.GridPageSize),
      total: this.nodeList.length
    }
  }

  private onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      this.selectedNodes = this.nodeList.map((item) => item.ID);
      this.selectAllState = 'checked';
    }
    else {
      this.selectedNodes = [];
      this.selectAllState = 'unchecked';
    }
  }

  /*******************************************Criaçao e Edição**********************************************/
  private ClearNodeInput() {
    this.newNode.Name = "";
    this.newNode.Label = "";
    this.newNode.Xpath = "";
    this.newNode.Type = "";
    this.newNode.ID = "";
    this.newNode.ParentID = "";
    this.newNode.isEditable = false;
    this.newNode.groupID = "";
  }

  private AddNodeToTable() {

    let tmpNode: NodeItem = {
      ID: this.serviceUtils.GetNewGuidId(),
      Name: this.newNode.Name,
      Label: this.newNode.Label,
      Xpath: this.newNode.Xpath,
      TypeId: this.newNode.Type,
      TypeDesc: this.selectedtype.nativeElement.selectedOptions[0].text,
      isNew: true,
      isDeleted: false,
      isEdited: false,
      RelNodDesc: "",
      RelNodId: "",
      NodParentId: this.newNode.ParentID,
      NodParentName:"",      
      isEditable: this.newNode.isEditable,
      groupID: this.newNode.groupID,
      groupDesc: ""
    };

    if(this.newNode.ParentID != null && this.newNode.ParentID != ""){
      tmpNode.NodParentName = this.selectedParent.nativeElement.selectedOptions[0].text;
    }

    if(this.newNode.groupID != null && this.newNode.groupID != ""){
      tmpNode.groupDesc = this.selectedNodgroup.nativeElement.selectedOptions[0].text;
    }

    if (tmpNode.TypeDesc.toLowerCase() == "lista") {
      tmpNode.NodParentId = "";
      tmpNode.NodParentName = "";
      this._NodePaiList.push({ ID: tmpNode.ID, DESC: tmpNode.Label });
    }

    if (this.selectAllState == 'checked') {
      this.selectedNodes.push(tmpNode.ID);
    }

    this.nodeList.push(tmpNode);

    this.ClearNodeInput();
    this.GridReload();
  }

  private IsInputValid() {
    return this.newNode.Label.trim() != "" && this.newNode.Name.trim() != "" && this.newNode.Xpath.trim() != "" && this.newNode.Type != "";
  }

  private EditNodeItem(itemID: string) {
    var temp = this.nodeList.find(x => x.ID == itemID);
    if (temp != null) {
      this.newNode.Name = temp.Name;
      this.newNode.Label = temp.Label;
      this.newNode.ID = temp.ID;
      this.newNode.Type = temp.TypeId;
      this.newNode.Xpath = temp.Xpath;
      this.newNode.ParentID = temp.NodParentId;
      this.newNode.isEditable = temp.isEditable;
      this.newNode.groupID = temp.groupID;
    }

    if (temp.TypeDesc.toLowerCase() == "lista") {
      var thisndlst = this._NodePaiList.find(x => x.ID == temp.ID);
      if (thisndlst != null) {
        var idx = this._NodePaiList.indexOf(thisndlst);
        this._NodePaiList.splice(idx, 1);
      }
    }
  }

  private UpdateNodeTable() {
    var temp = this.nodeList.find(x => x.ID == this.newNode.ID);

    if (temp != null) {

      let idxUpdt = this.nodeList.indexOf(temp);

      this.nodeList[idxUpdt].Name = this.newNode.Name;
      this.nodeList[idxUpdt].Label = this.newNode.Label;
      this.nodeList[idxUpdt].ID = this.newNode.ID;
      this.nodeList[idxUpdt].TypeId = this.newNode.Type;
      this.nodeList[idxUpdt].Xpath = this.newNode.Xpath;
      this.nodeList[idxUpdt].TypeDesc = this.selectedtype.nativeElement.selectedOptions[0].text;
      this.nodeList[idxUpdt].NodParentId = this.newNode.ParentID;
      this.nodeList[idxUpdt].isEditable = this.newNode.isEditable;
      this.nodeList[idxUpdt].groupID = this.newNode.groupID;
      
      if(this.newNode.ParentID != null && this.newNode.ParentID != ""){
        this.nodeList[idxUpdt].NodParentName = this.selectedParent.nativeElement.selectedOptions[0].text;
      }
      
      if(this.newNode.groupID != null && this.newNode.groupID != ""){
        this.nodeList[idxUpdt].groupDesc = this.selectedNodgroup.nativeElement.selectedOptions[0].text;
      }

      if (!this.nodeList[idxUpdt].isNew) {
        this.nodeList[idxUpdt].isEdited = true;
      }

      if (temp.TypeDesc.toLowerCase() == "lista") {
        this.nodeList[idxUpdt].NodParentId = "";
        this.nodeList[idxUpdt].NodParentName = "";
        var thisndlst = this._NodePaiList.find(x => x.ID == temp.ID);
        if (thisndlst == null) {
          this._NodePaiList.push({ ID: this.nodeList[idxUpdt].ID, DESC: this.nodeList[idxUpdt].Label });
        }
      }
      else {
        var oldChilds = this.nodeList.filter(x=> x.NodParentId == temp.ID);
          for(var b = 0; b < oldChilds.length; b++){
            oldChilds[b].NodParentId = "";
            oldChilds[b].NodParentName = "";
          }
      }

      this.GridReload();

      this.ClearNodeInput();
    }
  }

  private DeleteNodeTable() {

    if (this.selectAllState == 'checked') {
      let tmpArray: Array<NodeItem> = new Array<NodeItem>();

      for (var i = 0; i < this.nodeList.length; i++) {
        this.nodeList[i].isDeleted = true;
        if (!this.nodeList[i].isNew) {
          tmpArray.push(this.nodeList[i]);
        }
      }

      this.nodeList = tmpArray;
    }
    else {

      for (var i = 0; i < this.selectedNodes.length; i++) {
        var temp = this.nodeList.find(x => x.ID == this.selectedNodes[i]);

        if (temp != null) {
          let idxItm = this.nodeList.indexOf(temp);
          this.nodeList[idxItm].isDeleted = true;

          // if(this.nodeList[idxItm].isNew)
          // {
          this.nodeList.splice(idxItm, 1);
          //}
        }
      }
    }
    this.selectAllState = "unchecked";
    this.GridReload();
  }

  /*******************************************Criação de um Grupo Novo**********************************************/
  private AddNewNodeGroup(){
    
    let modalId = this.serviceUtils.GetNewGuidId();

    let modalConfig = {
      keyboard: false,
      ignoreBackdropClick: true,
      modalService: this._bsModalService,
      initialState:{
        ModalID: modalId,
        DocId: this.documentID
      }
    };

    this.bsModalRef = this._bsModalService.show(ModalNodeGroupComponent, modalConfig);     

    this.curSubscribe = this._bsModalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        var mdlResult = JSON.parse(result);

        if(mdlResult.Modal == "NodeGroup" && mdlResult.ModalId == modalId){
          this.LoadNodeGroup(mdlResult.GrpID);
          this.curSubscribe.unsubscribe();
        }
      }
    });
  }
}
