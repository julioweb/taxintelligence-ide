import { Component, OnInit,ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { DocumentsService } from "../../../services/data/documents/documents.service";
import { ServiceUtils } from "../../../services/Utils/Utils";

 import { NodesComponent } from './../../../nodes/nodes.component';
 import { DocumentVersionComponent } from "../../../document-version/document-version.component";

import { DocProcess } from "../../../models/Documents";
import { KeyValue } from "../../../models/KeyValue";


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

  public LevelData: Array<KeyValue> = new Array<KeyValue>();
  
  constructor(public docProcess: DocumentsService) {
    docProcess.GetDocLevelType().subscribe(a => {
      this.LevelData = a;
    });

    this.serviceUtils = new ServiceUtils();

    this.docObjt.ID = this.serviceUtils.GetNewGuidId();
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {    
    let nodesList = this.nodesChild.RetrieveNodeList();
    let versionList = this.docVersion.RetrieveVersionList();
    console.log(nodesList);
    console.log(versionList);
  }

  VersionChildCalling($event){
    let nodesList = this.nodesChild.RetrieveNodeList();
    this.docVersion.SetNodeList(nodesList,$event);
  }

}
