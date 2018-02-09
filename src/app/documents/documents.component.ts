import { Component, OnInit } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
// import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

// import { DocProcessList, DocProcess } from "../models/Documents";
import { DocumentsService } from "../services/data/documents/documents.service";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;

  constructor(public docProcess: DocumentsService) { 
    this.GridSkip = 0;
    this.GridReload();
  }

  ngOnInit() {
  }

  /************************************************************************** Operações do Grid **************************************************************************/
  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.GridReload();
  }

  public GridReload() {
    
    this.docProcess.GetDocumentsList(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
    });
  }

  AddGridVersao(itemID:string){

  }

  AddNewDocument(){

  }
}
