import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';

import { ServiceUtils } from "../services/Utils/Utils";
import { DocumentsService } from "../services/data/documents/documents.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs/Subscription';

import { ModalVersionDocComponent } from "../modais/modal-version-doc/modal-version-doc.component";

import { DocVersionModel } from "../models/Documents";
import { KeyValue } from "../models/KeyValue";
import { NodeItem } from "../models/Nodes";

@Component({
  selector: 'document-version',
  templateUrl: './document-version.component.html',
  styleUrls: ['./document-version.component.css']
})
export class DocumentVersionComponent implements OnInit {

  private serviceUtils: ServiceUtils;

  @Input('docPai') ParentId: string;
  @Input('isNewDoc') isNewDoc: boolean = false;
  @Input('isEditDoc') isEditDoc: boolean = false;
  @Input('docLevel') ParentLevel: number;
  @Output('docVersionPhone') parentPhone: EventEmitter<String> = new EventEmitter<String>();

  public selectAllState: SelectAllCheckboxState = 'unchecked';

  public selectedVersions: string[] = [];
  bsModalRef: BsModalRef;
  private curSubscribe: Subscription;

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;


  ModalConfig = {
    keyboard: false,
    ignoreBackdropClick: true,
    initialState: null,
    class: "avl-modal-form"
  };
  versionList: Array<DocVersionModel>;
  nodeList: Array<NodeItem>;

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

  constructor(private modalService: BsModalService,
              private bsDocService: DocumentsService) {
    this.serviceUtils = new ServiceUtils();
    this.versionList = new Array<DocVersionModel>();
  }


  ngOnInit() {
  }


  public RetrieveVersionList() {
    return this.versionList;
  }

  public LoadVersionsFromServer(docParent:string){
    
    this.ParentId = docParent;
    this.bsDocService.GetDocVersionList(this.ParentId,0,1000).subscribe(a=> {
      this.versionList = a.Data;
      this.GridReload();
    });
  }

  /*********************************************************************GRID***********************************************************/

  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  private onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      this.selectedVersions = this.versionList.map((item) => item.ID);
      this.selectAllState = 'checked';
    }
    else {
      this.selectedVersions = [];
      this.selectAllState = 'unchecked';
    }
  }

  public GridReload() {
    this.GridData = {
      data: this.versionList.slice(this.GridSkip, this.GridSkip + this.GridPageSize),
      total: this.versionList.length
    }
  }

  /*************************************************************Operações de Cadastro*********************************************************/
  private ClearVersionInput() {
    this.newVersion.Name = "";
    this.newVersion.Namespace = "";
    this.newVersion.Prefix = "";
    this.newVersion.Desc = "";
    this.newVersion.ID = "";
  }

  public SetNodeList(freshList: Array<NodeItem>, type: string) {
    this.nodeList = freshList;

    switch (type) {
      case 'add': this.OpenAddModal(); break;
      case 'update': this.EditVersionItem(this.newVersion.ID); break;
    }
  }

  private RequestUpdatedNodes(opType: string) {
    this.parentPhone.emit(opType);
  }


  private AddVersionToTable() {
    let tmpVersion: DocVersionModel = {
      ID: this.serviceUtils.GetNewGuidId(),
      DocID: this.ParentId,
      Name: this.newVersion.Name,
      Desc: this.newVersion.Desc,
      Namespace: this.newVersion.Namespace,
      Prefix: this.newVersion.Prefix,
      isNew: true,
      isDeleted: false,
      isEdited: false,
      SelNodes: this.newVersion.SelNodes,
      RelacItems: this.newVersion.RelacItems,
      DocRelac: this.newVersion.DocRelac
    };

    this.versionList.push(tmpVersion);

    if (this.selectAllState == 'checked') {
      this.selectedVersions.push(tmpVersion.ID);
    }

    //this.ClearVersionInput();
    this.GridReload();
  }

  private InitAddModal() {
    this.RequestUpdatedNodes("add");
  }

  public SetDocumentLevel(newLevel: number) {
    this.ParentLevel = newLevel;
  }
  private OpenAddModal() {
    this.ModalConfig.initialState = {
      _nodeList: this.nodeList,
      curLevelType: this.ParentLevel
    };
    this.bsModalRef = this.modalService.show(ModalVersionDocComponent, this.ModalConfig);

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != null && result != "") {
        var mdlResult = JSON.parse(result)

        if (mdlResult.Modal == "NewVersion") {
          if (mdlResult.Data != null) {
            this.newVersion = mdlResult.Data;
            this.AddVersionToTable();
          }

          this.curSubscribe.unsubscribe();
        }

        // if (result == "true") {
        //   this.docProcess.ApproveSingleItem(item.ID).subscribe(a => {

        //     let alertState = {
        //       Message: `A aprovação foi efetuada com sucesso.`,
        //       title: "Aprovado!",
        //       alertType: "success"
        //     };

        //     if (a != "OK") {
        //       alertState.title = "Ops!!"
        //       if (a == "serverError" || a == "ERRO") {
        //         alertState.Message = "Ocorreu um erro ao tentar aprovar o item, tente novamente mais tarde!";
        //       }
        //       else {
        //         alertState.Message = a;
        //       }
        //       alertState.alertType = "danger";
        //     }

        //     this.modalService.show(ModalAlertComponent, { initialState: alertState });
        //     this.GridReload();
        //   });
        // }
      }
    });
  }

  private InitEditVersion(itemID: string) {
    this.newVersion.ID = itemID;
    this.parentPhone.emit('update');
  }
  private EditVersionItem(itemID: string) {
    var temp = this.versionList.find(x => x.ID == itemID);
    if (temp != null) {
      this.newVersion.Name = temp.Name;
      this.newVersion.Desc = temp.Desc;
      this.newVersion.ID = temp.ID;
      this.newVersion.Prefix = temp.Prefix;
      this.newVersion.Namespace = temp.Namespace;
      this.newVersion.SelNodes = temp.SelNodes;
      this.newVersion.RelacItems = temp.RelacItems;
      this.newVersion.DocRelac = temp.DocRelac;

      let curMdlState = {
        newVersion: this.newVersion,
        _nodeList: this.nodeList,
        curLevelType: this.ParentLevel
      };
      this.ModalConfig.initialState = curMdlState

      this.bsModalRef = this.modalService.show(ModalVersionDocComponent, this.ModalConfig);

      this.curSubscribe = this.modalService.onHidden.subscribe(result => {
        if (result != null && result != "") {

          var mdlResult = JSON.parse(result)

          if (mdlResult.Modal == "NewVersion") {
            if (mdlResult.Data != null) {
              this.newVersion = mdlResult.Data;
              this.UpdateVersionTable();
            }
          }

        }
      });
    }
  }

  private UpdateVersionTable() {
    var temp = this.versionList.find(x => x.ID == this.newVersion.ID);

    if (temp != null) {

      let idxUpdt = this.versionList.indexOf(temp);

      this.versionList[idxUpdt].Name = this.newVersion.Name;
      this.versionList[idxUpdt].Desc = this.newVersion.Desc;
      this.versionList[idxUpdt].ID = this.newVersion.ID;
      this.versionList[idxUpdt].Namespace = this.newVersion.Namespace;
      this.versionList[idxUpdt].Prefix = this.newVersion.Prefix;
      this.versionList[idxUpdt].SelNodes = this.newVersion.SelNodes;
      this.versionList[idxUpdt].DocRelac = this.newVersion.DocRelac;
      this.versionList[idxUpdt].RelacItems = this.newVersion.RelacItems;

      if (!this.versionList[idxUpdt].isNew)
        this.versionList[idxUpdt].isEdited = true;

      this.GridReload();

      this.ClearVersionInput();
    }
  }

  private DeleteVersionTable() {
    if (this.selectAllState == 'checked') {
      let tmpArray: Array<DocVersionModel> = new Array<DocVersionModel>();

      for (var i = 0; i < this.versionList.length; i++) {
        this.versionList[i].isDeleted = true;
        if (!this.versionList[i].isNew) {
          tmpArray.push(this.versionList[i]);
        }
      }

      this.versionList = tmpArray;
    }
    else {

      for (var i = 0; i < this.selectedVersions.length; i++) {
        var temp = this.versionList.find(x => x.ID == this.selectedVersions[i]);

        if (temp != null) {
          let idxItm = this.versionList.indexOf(temp);
          this.versionList[idxItm].isDeleted = true;

          //if (this.versionList[idxItm].isNew) {
            this.versionList.splice(idxItm, 1);
          //}
        }
      }
    }
    this.selectAllState = "unchecked";
    this.GridReload();
  }
}
