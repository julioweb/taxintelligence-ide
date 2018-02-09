import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { NodeItem } from "../../models/Nodes";

@Component({
  selector: 'app-modal-version-doc',
  templateUrl: './modal-version-doc.component.html',
  styleUrls: ['./modal-version-doc.component.css']
})
export class ModalVersionDocComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,
    public bsModalService: BsModalService) {
  }

  newVersion = {
    ID: "",
    Name: "",
    Namespace: "",
    Prefix: "",
    Desc: "",
    SelNodes:[]
  }

  hasName = true;
  hasDesc = true;
  _nodeList: Array<NodeItem> = new Array<NodeItem>();
  _AvaibleNodeList: Array<NodeItem> = new Array<NodeItem>();
  _SelectedList: Array<NodeItem> = new Array<NodeItem>();

  @ViewChild('AvaibleColumns') avaibleLstElmnt: ElementRef;
  @ViewChild('SelectedColumns') selectLstElmnt: ElementRef;

  ngOnInit() {
    this._AvaibleNodeList = this._nodeList.map(x => Object.assign({}, x));
    if(this.newVersion.SelNodes != null && this.newVersion.SelNodes.length > 0)
    {
      var idxArray:Array<number> = new Array<number>();

      for(var i = 0; i < this.newVersion.SelNodes.length; i++)
      {
        var item = this._AvaibleNodeList.find(x=> x.Id ==this.newVersion.SelNodes[i]);
        this._SelectedList.push(item);
        idxArray.push(this._AvaibleNodeList.indexOf(item));
      }
      
      if(idxArray.length == this._AvaibleNodeList.length){
        this._AvaibleNodeList = new Array<NodeItem>();
      }         
      else{
        for(var i = 0;i<idxArray.length; i++ ){
          this._AvaibleNodeList.splice(idxArray[i], 1);        
        }
      }      
    }
  }

  private IsInputValid() {
    let isValid = true;
    this.hasName = this.newVersion.Name.trim() != "";
    this.hasDesc = this.newVersion.Desc.trim() != "";
    isValid = this.hasDesc && this.hasName;
    return isValid;
  }

  onConfirm(): void {
    if (this.IsInputValid()) {

      this.newVersion.SelNodes = new Array<string>();
      for(var i= 0; i < this._SelectedList.length; i++){
        this.newVersion.SelNodes.push(this._SelectedList[i].Id);
      }     

      this.bsModalService.setDismissReason(JSON.stringify(this.newVersion));
      this.bsModalRef.hide();
    }
  }

  SetItemSelected(event, typeClick) {
    let className = " list-group-item-info";

    if (typeClick == "remove") {
      className = " list-group-item-danger";
    }

    if (event.target.className.indexOf(className.trim()) >= 0) {
      event.target.className = event.target.className.replace(className, "");
    }
    else {
      event.target.className = event.target.className + className;
    }
  }

  SelectItem(all: boolean) {
    
    if (all) {
      for(var i = 0; i< this._AvaibleNodeList.length; i++){
        this._SelectedList.push(this._AvaibleNodeList[i]);
      }
      
      this._AvaibleNodeList = new Array<NodeItem>();
    }
    else {
      var childrenLst = this.avaibleLstElmnt.nativeElement.children;
      var idxArray:Array<number> = new Array<number>();
      
      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-info") >= 0) {
          var item = this._AvaibleNodeList[childrenLst[i].value];
          this._SelectedList.push(item);

          idxArray.push(i);          
        }        
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-info", "");
      }
      for(var i = 0;i<idxArray.length; i++ ){
        this._AvaibleNodeList.splice(idxArray[i], 1);
      }
    }
  }

  UnselectItem(all: boolean) {
    if (all) {
      for(var i = 0; i< this._SelectedList.length; i++){
        this._AvaibleNodeList.push(this._SelectedList[i]);
      }
      this._SelectedList = new Array<NodeItem>();
    }
    else {      
      var childrenLst = this.selectLstElmnt.nativeElement.children;
      var idxArray:Array<number> = new Array<number>();
      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-danger") >= 0) {
          var item = this._SelectedList[childrenLst[i].value];
          this._AvaibleNodeList.push(item);
          idxArray.push(i);          
        }
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-danger", "");
      }
      for(var i = 0;i < idxArray.length; i++ ){
        this._SelectedList.splice(childrenLst[i].value, 1);
      }
    }
  }

}
