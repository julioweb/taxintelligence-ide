import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';

import { ServiceUtils } from "../services/Utils/Utils";
import { NodesService } from "../services/data/nodes/nodes.service";

import { NodeType, NodeItem } from "../models/Nodes";
import { KeyValue } from "../models/KeyValue";

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
    Type:"",
    ID:""
  }
  nodeList:Array<NodeItem>;

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;
  private serviceUtils:ServiceUtils;
  public selectAllState: SelectAllCheckboxState = 'unchecked';

  public selectedNodes:string[] = [];

  @ViewChild('typeSel') selectedtype: ElementRef;

  public NodesType: Array<NodeType> = new Array<NodeType>();
  
  constructor(private nodService: NodesService) { 
    
    this.serviceUtils = new ServiceUtils();

    nodService.GetNodeListType().subscribe(a=> {
      this.NodesType =a;
    });

    this.nodeList = new Array<NodeItem>();
  }

  ngOnInit() {
  }

  public RetrieveNodeList(){
    return this.nodeList;
  }

  public LoadNodesFromServe(docParentID:string){
    this.nodService.GetDocumentNodes(docParentID).subscribe(a=> {
     this.nodeList = a;
     this.GridReload();
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
  private ClearNodeInput(){
    this.newNode.Name= "";
    this.newNode.Label= "";
    this.newNode.Xpath= "";
    this.newNode.Type= "";
    this.newNode.ID = "";
  }

  private AddNodeToTable(){

    let tmpNode:NodeItem = {
      ID: this.serviceUtils.GetNewGuidId(),
      Name: this.newNode.Name,
      Label: this.newNode.Label,
      Xpath: this.newNode.Xpath,
      TypeId: this.newNode.Type,
      TypeDesc: this.selectedtype.nativeElement.selectedOptions[0].text,
      isNew:true,
      isDeleted:false,
      isEdited:false,
      RelNodDesc:"",
      RelNodId:"",
      NodParentId:"",
      NodParentName:""
    };

    this.nodeList.push(tmpNode);

    if(this.selectAllState == 'checked'){
      this.selectedNodes.push(tmpNode.ID);
    }

    this.ClearNodeInput();
    this.GridReload();
  }

  private IsInputValid(){
    return this.newNode.Label.trim() != "" && this.newNode.Name.trim() != "" && this.newNode.Xpath.trim() != "" && this.newNode.Type != "";
  }

  private EditNodeItem(itemID:string){
    var temp = this.nodeList.find(x=> x.ID == itemID);
    if(temp != null){
      this.newNode.Name = temp.Name;
      this.newNode.Label = temp.Label;
      this.newNode.ID = temp.ID;
      this.newNode.Type = temp.TypeId;
      this.newNode.Xpath = temp.Xpath;
    }
  }

  private UpdateNodeTable(){
    var temp = this.nodeList.find(x=> x.ID == this.newNode.ID);
    
    if(temp != null){

      let idxUpdt = this.nodeList.indexOf(temp);
      
      this.nodeList[idxUpdt].Name = this.newNode.Name;
      this.nodeList[idxUpdt].Label = this.newNode.Label;
      this.nodeList[idxUpdt].ID = this.newNode.ID;
      this.nodeList[idxUpdt].TypeId = this.newNode.Type;
      this.nodeList[idxUpdt].Xpath = this.newNode.Xpath;
      if(!this.nodeList[idxUpdt].isNew)
            this.nodeList[idxUpdt].isEdited = true;

      this.GridReload();

      this.ClearNodeInput();
    }
  }

  private DeleteNodeTable(){
    
    if(this.selectAllState == 'checked'){
       let tmpArray:Array<NodeItem> = new Array<NodeItem>();

       for(var i = 0; i< this.nodeList.length; i++)
       {
         this.nodeList[i].isDeleted = true;
         if(!this.nodeList[i].isNew){
           tmpArray.push(this.nodeList[i]);
         }
       }

       this.nodeList = tmpArray;
    }
    else{
      
      for(var i = 0; i< this.selectedNodes.length; i++){        
        var temp = this.nodeList.find(x=> x.ID == this.selectedNodes[i]);
    
        if(temp != null){
          let idxItm = this.nodeList.indexOf(temp);
          this.nodeList[idxItm].isDeleted = true;

          // if(this.nodeList[idxItm].isNew)
          // {
             this.nodeList.splice(idxItm,1);
          //}
        }
      }
    }
    this.selectAllState = "unchecked";
    this.GridReload();
  }

}
