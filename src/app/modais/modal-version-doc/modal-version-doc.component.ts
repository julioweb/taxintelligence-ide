import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DocumentsService } from '../../services/data/documents/documents.service';
import { NodesService } from "../../services/data/nodes/nodes.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalNewRelacComponent } from "../modal-new-relac/modal-new-relac.component";

import { DocumentModel, DocVersionModel } from "../../models/Documents";
import { NodeItem } from "../../models/Nodes";
import { KeyValue } from "../../models/KeyValue";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-modal-version-doc',
  templateUrl: './modal-version-doc.component.html',
  styleUrls: ['./modal-version-doc.component.css']
})
export class ModalVersionDocComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,
    public bsModalRefNode: BsModalRef,
    public bsModalRefNodeService: BsModalService,
    public bsModalService: BsModalService,
    public docService: DocumentsService,
    public nodeService: NodesService) {
  }

  newVersion = {
    ID: "",
    Name: "",
    Namespace: "",
    Prefix: "",
    Desc: "",
    SelNodes: [],
    RelacItems: [],
    DocRelac: {
      docID: "",
      versaoID: ""
    }
  }
  curLevelType: number;
  curSubscribe: Subscription;
  hasName = true;
  hasDesc = true;
  _nodeList: Array<NodeItem> = new Array<NodeItem>();
  _AvaibleNodeList: Array<NodeItem> = new Array<NodeItem>();
  _SelectedList: Array<NodeItem> = new Array<NodeItem>();

  _RelacDocsLst: Array<DocumentModel> = new Array<DocumentModel>();
  _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();
  _RelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();
  _AvaibleRelacVersionNodList: Array<NodeItem> = new Array<NodeItem>();

  @ViewChild('AvaibleColumns') avaibleLstElmnt: ElementRef;
  @ViewChild('SelectedColumns') selectLstElmnt: ElementRef;

  ngOnInit() {
    this._AvaibleNodeList = this._nodeList.map(x => Object.assign({}, x));
    if (this.newVersion.SelNodes != null && this.newVersion.SelNodes.length > 0) {
      var idxArray: Array<string> = new Array<string>();

      for (var i = 0; i < this.newVersion.SelNodes.length; i++) {
        var item = this._AvaibleNodeList.find(x => x.ID == this.newVersion.SelNodes[i]);
        this._SelectedList.push(item);
        idxArray.push(item.ID);
      }

      if (idxArray.length == this._AvaibleNodeList.length) {
        this._AvaibleNodeList = new Array<NodeItem>();
      }
      else {
        for (var i = 0; i < idxArray.length; i++) {
          var remItem = this._AvaibleNodeList.find(x => x.ID == idxArray[i])
          let idxrem = this._AvaibleNodeList.indexOf(remItem);
          this._AvaibleNodeList.splice(idxrem, 1);
          //this._AvaibleNodeList.splice(idxArray[i], 1);        
        }
      }
    }
    this.docService.GetDocListByLevelType(this.curLevelType).subscribe(a => {
      this._RelacDocsLst = a;

      if (this.newVersion.DocRelac.docID != "" && this.newVersion.DocRelac.docID != null) {
        if (this._RelacDocsLst.find(x => x.ID == this.newVersion.DocRelac.docID) != null) {
          this.GetVersionrelacList(true);
        }
      }
    });
  }

  GetVersionListNodes(isLoad: boolean) {
    this.nodeService.GetVersionNodes(this.newVersion.DocRelac.versaoID).subscribe(a => {
      this._RelacVersionNodList = a;
      this._AvaibleRelacVersionNodList = new Array<NodeItem>();
      for (var i = 0; i < this._RelacVersionNodList.length; i++) {
        let canAddItem = true;

        if (isLoad) {
          if (this.newVersion.RelacItems.length > 0) {
            var item = this.newVersion.RelacItems.find(x => x.Value == this._RelacVersionNodList[i].ID);
            if (item != null) {
              var selItem = this._SelectedList.find(x => x.ID == item.Key);
              selItem.RelNodId = this._RelacVersionNodList[i].ID;
              selItem.RelNodDesc = this._RelacVersionNodList[i].Label;
              canAddItem = false;
            }
          }
        }

        if (canAddItem) {
          this._AvaibleRelacVersionNodList.push(this._RelacVersionNodList[i]);
        }
      }
    });
  }

  GetVersionrelacList(isLoad: boolean) {
    this.docService.GetDocVersionList(this.newVersion.DocRelac.docID, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;
      if (isLoad) {
        if (this._RelacDocVersionLst.find(x => x.ID == this.newVersion.DocRelac.versaoID) != null) {
          this.GetVersionListNodes(true);
        }
      }
    });
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
      this.newVersion.RelacItems = new Array<KeyValue>();

      for (var i = 0; i < this._SelectedList.length; i++) {
        this.newVersion.SelNodes.push(this._SelectedList[i].ID);
        if (this._SelectedList[i].RelNodId != "") {
          this.newVersion.RelacItems.push({
            Key: this._SelectedList[i].ID,
            Value: this._SelectedList[i].RelNodId
          });
        }
      }
      let hresult = {
        Modal: "NewVersion",
        Data: this.newVersion
      }

      this.bsModalService.setDismissReason(JSON.stringify(hresult));
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
      for (var i = 0; i < this._AvaibleNodeList.length; i++) {
        this._SelectedList.push(this._AvaibleNodeList[i]);
      }

      this._AvaibleNodeList = new Array<NodeItem>();
    }
    else {
      var childrenLst = this.avaibleLstElmnt.nativeElement.children;
      var idxArray: Array<string> = new Array<string>();

      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-info") >= 0) {
          var item = this._AvaibleNodeList[childrenLst[i].value];
          this._SelectedList.push(item);

          idxArray.push(item.ID);
        }
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-info", "");
      }
      for (var i = 0; i < idxArray.length; i++) {
        var remItem = this._AvaibleNodeList.find(x => x.ID == idxArray[i])
        let idxrem = this._AvaibleNodeList.indexOf(remItem);
        this._AvaibleNodeList.splice(idxrem, 1);
        //this._AvaibleNodeList.splice(idxArray[i], 1);
      }
    }
  }

  UnselectItem(all: boolean) {
    if (all) {
      for (var i = 0; i < this._SelectedList.length; i++) {
        this._AvaibleNodeList.push(this._SelectedList[i]);
      }
      this._SelectedList = new Array<NodeItem>();
    }
    else {
      var childrenLst = this.selectLstElmnt.nativeElement.children;
      var idxArray: Array<string> = new Array<string>();
      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-danger") >= 0) {
          var item = this._SelectedList[childrenLst[i].value];
          this._AvaibleNodeList.push(item);
          idxArray.push(item.ID);
        }
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-danger", "");
      }
      for (var i = 0; i < idxArray.length; i++) {
        var remItem = this._SelectedList.find(x => x.ID == idxArray[i])
        let idxrem = this._SelectedList.indexOf(remItem);
        this._SelectedList.splice(idxrem, 1);
        //this._SelectedList.splice(childrenLst[i].value, 1);
      }
    }
  }

  DeleteRelacNode(itemID: string) {
    let curSelect = this._SelectedList.find(x => x.ID == itemID);

    var oldItem = this._RelacVersionNodList.find(x => x.ID == curSelect.RelNodId);
    this._AvaibleRelacVersionNodList.push(oldItem);

    curSelect.RelNodDesc = "";
    curSelect.RelNodId = "";
  }
  OpenRelacNodeModal(item: NodeItem, isEdit: boolean) {
    let avaibleNodes = this._AvaibleRelacVersionNodList.filter(x => x.TypeId == item.TypeId).map(x => Object.assign({ Key: x.ID, Value: x.Label }));
    if (isEdit) {
      avaibleNodes.push({ Key: item.RelNodId, Value: item.RelNodDesc });
    }
    let modalConfig = {
      keyboard: false,
      ignoreBackdropClick: true,
      modalService: this.bsModalRefNodeService,
      initialState: {
        nodeList: avaibleNodes,
        SelValue: { Key: item.RelNodId, Value: item.RelNodDesc }
      }
    };

    this.bsModalRefNode = this.bsModalRefNodeService.show(ModalNewRelacComponent, modalConfig);

    this.curSubscribe = this.bsModalRefNodeService.onHidden.subscribe(result => {
      let curSelect = this._SelectedList.find(x => x.ID == item.ID);

      if (result != null && result != "") {
        var mdlResult = JSON.parse(result);

        let tmpItem = mdlResult.Data as KeyValue;

        if (curSelect.RelNodId != "" && curSelect.RelNodId != null
          && curSelect.RelNodId != tmpItem.Key) {
          var oldItem = this._RelacVersionNodList.find(x => x.ID == curSelect.RelNodId);
          this._AvaibleRelacVersionNodList.push(oldItem);
        }

        curSelect.RelNodDesc = tmpItem.Value;
        curSelect.RelNodId = tmpItem.Key;

        var selItem = this._AvaibleRelacVersionNodList.find(x => x.ID == tmpItem.Key);
        var idxSelItem = this._AvaibleRelacVersionNodList.indexOf(selItem);
        this._AvaibleRelacVersionNodList.splice(idxSelItem, 1);
      }
      else {
        curSelect.RelNodDesc = "";
        curSelect.RelNodId = "";
      }
      this.curSubscribe.unsubscribe();
    });
  }
}
