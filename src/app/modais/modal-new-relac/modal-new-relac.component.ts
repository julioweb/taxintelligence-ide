import { Component, OnInit } from '@angular/core';

import { KeyValue } from "../../models/KeyValue";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-modal-new-relac',
  templateUrl: './modal-new-relac.component.html',
  styleUrls: ['./modal-new-relac.component.css']
})
export class ModalNewRelacComponent implements OnInit {

  
  constructor(public bsModalRef: BsModalRef,
    private bsModalService: BsModalService) { }

  nodeList:Array<KeyValue> = new Array<KeyValue>();
  SelValue:string;
  ngOnInit() {
  }

  onConfirm(): void {
    let hresult = {
      Modal: "NodeRelac",
      Data: this.SelValue
    }
    this.bsModalService.setDismissReason(JSON.stringify(hresult));
    this.bsModalRef.hide();
  }

}
