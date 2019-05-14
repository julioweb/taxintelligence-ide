import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { ServiceUtils } from "../../services/Utils/Utils";
import { NodesService } from "../../services/data/nodes/nodes.service";
import { NodeGroup } from '../../models/Nodes';

@Component({
  selector: 'modal-node-group',
  templateUrl: './modal-node-group.component.html',
  styleUrls: ['./modal-node-group.component.css']
})
export class ModalNodeGroupComponent implements OnInit {

  public groupName:string;
  public hasName:boolean = true;

  public ModalID:string;
  public DocId:string;

  private serviceUtils: ServiceUtils;

  constructor(public bsModalService: BsModalService,
    public bsModalRef: BsModalRef,
    private nodService: NodesService) { 
      this.serviceUtils = new ServiceUtils();
    }
    

  ngOnInit() {
  }

  private IsInputValid() {
    let isValid = true;
    this.hasName = this.groupName!= null && this.groupName.trim() != "";
    isValid = this.hasName;
    return isValid;
  }

  onConfirm(): void {
    if(this.IsInputValid()){      

      let postItem: NodeGroup = {
        ID: this.serviceUtils.GetNewGuidId(),
        Name: this.groupName
      };

      this.nodService.SendNodeGroup(postItem,this.DocId).subscribe(a=>{
        let hresult = {
          Modal: "NodeGroup",
          ModalId: this.ModalID,
          GrpID: postItem.ID
        }
        this.bsModalService.setDismissReason(JSON.stringify(hresult));
        this.bsModalRef.hide();
      });
    }
  }

  onCancel(): void {
    let hresult = {
      Modal: "NewVersion",
      ModalId: this.ModalID
    }

    this.bsModalService.setDismissReason(JSON.stringify(hresult));
    this.bsModalRef.hide();
  }

}
