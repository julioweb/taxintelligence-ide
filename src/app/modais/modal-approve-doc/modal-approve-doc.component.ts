import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-approve-doc',
  templateUrl: './modal-approve-doc.component.html',
  styleUrls: ['./modal-approve-doc.component.css']
})
export class ModalApproveDocComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,public bsModalService: BsModalService) { }

  title:string = "";
  Message:string = "";
  hasJust:boolean = true;
  curObj = {
    isConfirmed:false,
    JustificativaVal: ""
  }
  ngOnInit() {
  }

  onConfirm():void{
    this.curObj.isConfirmed = true; 
    
    if(this.curObj.JustificativaVal != undefined && this.curObj.JustificativaVal.trim()!= "")
    {
      this.bsModalService.setDismissReason(JSON.stringify(this.curObj));
      this.bsModalRef.hide();
    }
    else this.hasJust = false;    
  }

  // curSubscribe:Subscription;
  // this.curSubscribe = this.modalService.onHidden.subscribe(result=>{
  //   if(result != null && result != "")
  //   {
  //     var tempOj = JSON.parse(result);
  //     if(tempOj.isConfirmed)
  //       {
  //         alert(tempOj.JustificativaVal);
  //       }
  //   }
    
  //   this.curSubscribe.unsubscribe();
  // });

}
