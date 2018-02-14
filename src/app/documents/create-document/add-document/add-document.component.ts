import { Component, OnInit,ViewChild,Input } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { DocumentsService } from "../../../services/data/documents/documents.service";
import { ServiceUtils } from "../../../services/Utils/Utils";
import { BsModalService } from 'ngx-bootstrap/modal';

import { NodesComponent } from './../../../nodes/nodes.component';
import { DocumentVersionComponent } from "../../../document-version/document-version.component";
import { ModalAlertComponent } from "../../../modais/modal-alert/modal-alert.component";

import { DocProcess,DocPostObject } from "../../../models/Documents";
import { KeyValue } from "../../../models/KeyValue";
import { Subscription } from 'rxjs/Subscription';
// import { ActivatedRoute } from '@angular/router/src/router_state';


@Component({
  selector: 'create-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  private serviceUtils:ServiceUtils;

  docObjt = {
    Name: "",
    Description: "",
    Level: 0,
    ID:""
  }

  @ViewChild('nodeChild') nodesChild:NodesComponent;
  @ViewChild('docVersion') docVersion:DocumentVersionComponent;

  @Input() docEditId: string;

  public LevelData: Array<KeyValue> = new Array<KeyValue>();
  curSubscribe:Subscription;
  
  constructor(public docProcess: DocumentsService,
              private modalService: BsModalService) {
    docProcess.GetDocLevelType().subscribe(a => {
      this.LevelData = a;
    });

    this.serviceUtils = new ServiceUtils();

    this.docEditId = "281577B2-535D-1CBE-88F5-A06459BD0088";//route.snapshot.params["Id"];
    this.docObjt.ID = this.serviceUtils.GetNewGuidId();
  }

  ngOnInit() {
     if(this.docEditId != null && this.docEditId != ""){
      this.LoadDocument();
    }
  }

  LoadDocument(){
    this.docProcess.GetDocumentById(this.docEditId).subscribe(a=>{
      this.docObjt = a;

      this.nodesChild.LoadNodesFromServe(this.docObjt.ID);
      this.docVersion.LoadVersionsFromServer(this.docObjt.ID);
    });
  }

  onSubmit(form: NgForm) {    
    let nodesList = this.nodesChild.RetrieveNodeList();
    let versionList = this.docVersion.RetrieveVersionList();
    this.docObjt;
    
    let postObj:DocPostObject = {
      Properties: this.docObjt,
      NodeList: nodesList,
      VersionList: versionList
    };

    // console.log(nodesList);
    // console.log(versionList);
    // console.log(postObj);
    let isEdit = this.docEditId != "" && this.docEditId != null;

    this.docProcess.SendDocPost(postObj,isEdit).subscribe(a => {

      let alertState = {
        Message: `O registro foi salvo com sucesso`,
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
            alertState.Message = "Ocorreu um erro ao tentar salvar o item, tente novamente mais tarde!";
          }
          else {
            alertState.Message = a;
          }
          alertState.alertType = "danger";
        }
      }

      this.modalService.show(ModalAlertComponent, { initialState: alertState });
    });

  }

  VersionChildCalling($event){
    let nodesList = this.nodesChild.RetrieveNodeList();
    this.docVersion.SetNodeList(nodesList,$event);
  }

  DocTypeChanged(){
    this.docVersion.SetDocumentLevel(this.docObjt.Level);
  }
}
