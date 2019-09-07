import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import { FullLoadingComponent } from '../modais/full-loading/full-loading.component';
import { CustomMethodsService } from '../services/data/custom-methods/custom-methods.service';

@Component({
  selector: 'app-custom-methods',
  templateUrl: './custom-methods.component.html',
  styleUrls: ['./custom-methods.component.css']
})
export class CustomMethodsComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  constructor(private bsCustomMethods: CustomMethodsService, private router: Router) { 
    this.GridSkip = 0;
    this.GridReload();
  }

  ngOnInit() {
    this.fullLoading.showLoading();
  }

  /************************************************************************** Operações do Grid **************************************************************************/
  public pageChange(event: PageChangeEvent): void {
    this.fullLoading.showLoading();
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public AtualizaGrid() {
    this.fullLoading.showLoading();
    this.GridReload();
  }

  public GridReload() {
    this.bsCustomMethods.GetCustomQueriesList(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.fullLoading.hideLoading();
      this.GridData = {
        data: a.Data,
        total: a.Total
      };
    });
  }

  AddCustomMethod() {
    this.router.navigate(['/add-custom-method']);
  }

  EditarCustomMethod(id) {
    this.router.navigate(
      ['/edit-custom-method'],
      {
        queryParams: {
          'id': id
        }
      }
    );
  }

}
