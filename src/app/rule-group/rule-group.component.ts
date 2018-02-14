import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import { RuleModelList } from "../models/RuleTot";

import { RuleService } from "../services/data/rules/rule.service";

@Component({
  selector: 'app-rule-group',
  templateUrl: './rule-group.component.html',
  styleUrls: ['./rule-group.component.css']
})
export class RuleGroupComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;

  constructor(
    private bsRules: RuleService,
    private router: Router) {
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

    this.bsRules.GetGroupRuleList(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      }
    });
  }

  AddNewRuleGroup() {
    this.router.navigate(['/add-rule-group']);
  }

  EditarRuleGroupItem(id) {
    this.router.navigate(
      ['/edit-rule-group'],
        {
          queryParams: {
            'id': id
          }
        }
    );
  }
}
