import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  title: string;
  Message: string;
  isConfirmed:boolean = false;
  alertType: string = '';
  constructor(public bsModalRef: BsModalRef,public bsModalService: BsModalService) { }

  ngOnInit() {
  }
  
  onConfirm():void{
    this.isConfirmed = true;   
    this.bsModalService.setDismissReason(this.isConfirmed.toString());
    this.bsModalRef.hide();
  }

  GetCssAlertClass(){
    let result = "";
    switch(this.alertType)
    {
      case('primary'): 
         result = 'alert alert-primary';
         break;
      case('secondary'): 
         result = 'alert alert-secondary';
         break;
      case('success'): 
         result = 'alert alert-success';
         break;
      case('danger'): 
         result = 'alert alert-danger';
         break;
      case('warning'): 
         result = 'alert alert-warning';
         break;
      case('info'): 
         result = 'alert alert-info';
         break;
      case('light'): 
         result = 'alert alert-light';
         break;
      case('dark'): 
         result = 'alert alert-dark';
         break;
    }
    return result;
  }

  // curSubscribe:Subscription;
  // this.curSubscribe = this.modalService.onHidden.subscribe(result=>{
  //   if(result != null && result != "" && result.toLowerCase() == "true"){
  //     alert('OK');        
  //   }
  //   this.curSubscribe.unsubscribe();
  // });

}
