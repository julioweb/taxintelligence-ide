import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentsService } from "../../services/data/documents/documents.service";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import{ DocBriefList } from "../../models/Documents";
import { ServiceUtils } from  "../../services/Utils/Utils";

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

  constructor(private documentService: DocumentsService,
    private svcUtils: ServiceUtils) {
    this.GridSkip = 0;
    this.GridReload(); 
  }

  ngOnInit() {}

  FormatCnpjItem(item:string)
  {
    return this.svcUtils.ConvertStringToCNPJ(item);
  }

  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.GridReload();
  }

  public GridReload(){
    this.documentService.GetDocProcessBrief(this.GridSkip,this.GridPageSize).subscribe(a=>{
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
    });
  }

}
