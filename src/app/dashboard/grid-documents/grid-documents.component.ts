import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DocumentsService } from "../../services/data/documents/documents.service";
import { GridDataResult, PageChangeEvent, SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';

import{ DocBriefList } from "../../models/Documents";
import { ServiceUtils } from  "../../services/Utils/Utils";
import { FullLoadingComponent } from '../../modais/full-loading/full-loading.component';

@Component({
  selector: 'app-dashgrid-documents',
  templateUrl: './grid-documents.component.html',
  styleUrls: ['./grid-documents.component.css'],
  providers: [DocumentsService,ServiceUtils]
})
export class GridDocumentsComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;
  public selectableSettings: SelectableSettings;
  private _selectedItem:any = null;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;
  
  constructor(private documentService: DocumentsService,
    private svcUtils: ServiceUtils) {
    this.GridSkip = 0;
    this.GridReload(); 
  }

  ngOnInit() {
    this.selectableSettings = {
      checkboxOnly: false,
      mode: "single"
    };
  }

  FormatCnpjItem(item:string)
  {
    return this.svcUtils.ConvertStringToCNPJ(item);
  }

  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.fullLoading.showLoading();
    this.GridReload();
  }

  public GridReload(){
    this.documentService.GetDocProcessBrief(this.GridSkip,this.GridPageSize).subscribe(a=>{
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
      this.fullLoading.hideLoading();
    });
  }
  public docSelectionChange(event:SelectionEvent):void{
    if(event.selected && event.selectedRows.length > 0)
    {
      this._selectedItem = event.selectedRows[0].dataItem;
    }
    else{
      this._selectedItem = null;
    }
  }
  public ReprocessSelItem(){
    this.fullLoading.showLoading();
    this.documentService.ReprocessDocument(this._selectedItem.ID).subscribe(a=>{
      this.GridSkip = 0;
      this.GridReload();
    });
  }

}
