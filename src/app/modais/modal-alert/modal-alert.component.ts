import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent implements OnInit {

  title: string;
  Message: string;
  alertType: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  GetCssTextClass() {
    let result = '';
    switch (this.alertType) {
      case ('primary'):
        result = 'text-primary';
        break;
      case ('secondary'):
        result = 'text-secondary';
        break;
      case ('success'):
        result = 'text-success';
        break;
      case ('danger'):
        result = 'text-danger';
        break;
      case ('warning'):
        result = 'text-warning';
        break;
      case ('info'):
        result = 'text-info';
        break;
      case ('light'):
        result = 'text-light';
        break;
      case ('dark'):
        result = 'text-dark';
        break;
    }
    return result;
  }

  GetCssAlertClass() {
    let result = "";
    switch (this.alertType) {
      case ('primary'):
        result = 'alert alert-primary';
        break;
      case ('secondary'):
        result = 'alert alert-secondary';
        break;
      case ('success'):
        result = 'alert alert-success';
        break;
      case ('danger'):
        result = 'alert alert-danger';
        break;
      case ('warning'):
        result = 'alert alert-warning';
        break;
      case ('info'):
        result = 'alert alert-info';
        break;
      case ('light'):
        result = 'alert alert-light';
        break;
      case ('dark'):
        result = 'alert alert-dark';
        break;
    }
    return result;
  }
}
