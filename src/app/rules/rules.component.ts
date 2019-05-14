import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import { RuleModelList } from "../models/RuleTot";
import { RuleService } from "../services/data/rules/rule.service";
import { FullLoadingComponent } from '../modais/full-loading/full-loading.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  constructor(private bsRules: RuleService, private router: Router) {
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
    this.bsRules.GetRulesList(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.fullLoading.hideLoading();
      this.GridData = {
        data: a.Data,
        total: a.Total
      };
    });
  }

  AddNewRule() {
    this.router.navigate(['/add-rule']);
  }

  EditarRuleItem(id) {
    this.router.navigate(
      ['/edit-rule'],
      {
        queryParams: {
          'id': id
        }
      }
    );
  }

}
