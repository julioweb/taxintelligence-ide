import { Component, OnInit, Input } from '@angular/core';


import { RuleService } from "../services/data/rules/rule.service";

import { ServiceUtils } from "../services/Utils/Utils";
import { RuleProcessList,RuleProcess} from "../models/RuleTot";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'rules-executed',
  templateUrl: './rules-executed.component.html',
  styleUrls: ['./rules-executed.component.css']
})
export class RulesExecutedComponent implements OnInit {

  @Input() ProcessID:string;
  private recebi:string;

  public GridData: GridDataResult = null;
  public GridPageSize: number = 5;
  public GridSkip: number = 0;

  public _ExeRuleList: Array<RuleProcessList>;

  constructor(private bsRules: RuleService) { }
  
  ngOnInit() {
  }

  public SetProcessID(prcID:string){
    this.ProcessID = prcID;  
    if(this.ProcessID != undefined)
        this.GridReload();  
  }

  /*******************************************Grid**********************************************/
  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public GridReload() {
    if(this.ProcessID != undefined)
    {
      this.bsRules.GetRuleProcessList(this.GridSkip, this.GridPageSize,this.ProcessID).subscribe(a => {
        this.GridData = {
          data: a.Data,
          total: a.Total
        };
      });
    }
    
  }
}
