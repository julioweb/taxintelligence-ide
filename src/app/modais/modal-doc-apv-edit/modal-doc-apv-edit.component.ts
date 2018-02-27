import { Component, OnInit } from '@angular/core';
import { ServiceUtils } from '../../services/Utils/Utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DocumentsService } from '../../services/data/documents/documents.service';
import { DocPrcEditData } from '../../models/Documents';

@Component({
  selector: 'modal-doc-apv-edit',
  templateUrl: './modal-doc-apv-edit.component.html',
  styleUrls: ['./modal-doc-apv-edit.component.css']
})
export class ModalDocApvEditComponent implements OnInit {

  public ModalID:string;
  public DocVersionId:string;
  public IsMultiple:boolean = false;
  public ProcessID: string;

  public objEditData:object = {};

  public _lstEditdata: Array<DocPrcEditData> = new Array<DocPrcEditData>();

  private serviceUtils: ServiceUtils;
  constructor(public bsModalService: BsModalService,
    public bsModalRef: BsModalRef,
    private bsDocument: DocumentsService) { 
      this.serviceUtils = new ServiceUtils();
  }

  ngOnInit() {
    this.bsDocument.GetDocProcessEditData(this.DocVersionId, this.ProcessID,this.IsMultiple).subscribe(a=> {
      this._lstEditdata = a;
    });
  }

  onConfirm(): void {
    let hresult = {
      Modal: "EditAprvDoc",
      ModalId: this.ModalID
    }
    this.bsModalService.setDismissReason(JSON.stringify(hresult));
    this.bsModalRef.hide();
  }

  onCancel(): void {
    let hresult = {
      Modal: "EditAprvDoc",
      ModalId: this.ModalID
    }

    this.bsModalService.setDismissReason(JSON.stringify(hresult));
    this.bsModalRef.hide();
  }

}
