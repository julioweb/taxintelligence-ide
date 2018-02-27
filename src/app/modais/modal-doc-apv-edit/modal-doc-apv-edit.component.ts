import { Component, OnInit,ViewChild } from '@angular/core';
import { ServiceUtils } from '../../services/Utils/Utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DocumentsService } from '../../services/data/documents/documents.service';
import { DocPrcEditData } from '../../models/Documents';
import { FullLoadingComponent } from '../../modais/full-loading/full-loading.component';

@Component({
  selector: 'modal-doc-apv-edit',
  templateUrl: './modal-doc-apv-edit.component.html',
  styleUrls: ['./modal-doc-apv-edit.component.css']
})
export class ModalDocApvEditComponent implements OnInit {

  public ModalID: string;
  public DocVersionId: string;
  public IsMultiple: boolean = false;
  public ProcessID: string;
  public lstProcessID:Array<string> = new Array<string>();

  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  public _lstEditdata: Array<DocPrcEditData> = new Array<DocPrcEditData>();

  private serviceUtils: ServiceUtils;
  constructor(public bsModalService: BsModalService,
    public bsModalRef: BsModalRef,
    private bsDocument: DocumentsService) {
    this.serviceUtils = new ServiceUtils();
  }

  ngOnInit() {
    this.fullLoading.showLoading();
    if(!this.IsMultiple){
      this.lstProcessID.push(this.ProcessID);
    }
    this.bsDocument.GetDocProcessEditData(this.DocVersionId, this.ProcessID, this.IsMultiple).subscribe(a => {

      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a[i].Nodes.length; j++) {
          a[i].Nodes[j].InitValue = a[i].Nodes[j].Value;
        }
      }
      this._lstEditdata = a;
      this.fullLoading.hideLoading();
    });
  }

  isEditedFielt(elmnt) {
    return elmnt.target.value != elmnt.target.getAttribute('data-initVal');
  }

  onConfirm(): void {

    var selPrc = this.lstProcessID;
    var lstNodes = [];

    for (var i = 0; i < this._lstEditdata.length; i++) {
      this._lstEditdata[i].Nodes.filter(x => x.isEdited == true).forEach(item => lstNodes.push(item));
    }    

    if (lstNodes.length > 0) {
      this.fullLoading.showLoading();
      this.bsDocument.SendDocProcessEditData(this.DocVersionId, selPrc, lstNodes).subscribe(a => {
        let hresult = {
          Modal: "EditAprvDoc",
          ModalId: this.ModalID,
          Result: a
        }
        this.fullLoading.hideLoading();
        this.bsModalService.setDismissReason(JSON.stringify(hresult));
        this.bsModalRef.hide();
      });
    }
    else {
      let hresult = {
        Modal: "EditAprvDoc",
        ModalId: this.ModalID,
        Result: "OK"
      }
      this.bsModalService.setDismissReason(JSON.stringify(hresult));
      this.bsModalRef.hide();
    }
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
