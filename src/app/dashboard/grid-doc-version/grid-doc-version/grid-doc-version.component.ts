import { Component, OnInit,Input } from '@angular/core';
import { GridDataResult, PageChangeEvent,GridComponent } from '@progress/kendo-angular-grid';
// import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

// import { DocProcessList, DocProcess } from "../models/Documents";
import { DocumentsService } from "../../../services/data/documents/documents.service";

@Component({
  selector: 'grid-doc-version',
  templateUrl: './grid-doc-version.component.html',
  styleUrls: ['./grid-doc-version.component.css']
})
export class GridDocVersionComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;
  
  @Input('docPai') docIdPai:string;

  @Input() public category: Object;

  constructor(public docProcess: DocumentsService,) {     
  }

  ngOnInit() {
    this.GridSkip = 0;
    this.GridReload();
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
    this.docProcess.GetDocVersionList(this.docIdPai,this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
    });
  }

}
