import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleService } from "../../services/data/rules/rule.service";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { RuleTot } from "../../models/RuleTot";

@Component({
  selector: 'app-dashgrid-rules',
  templateUrl: './grid-rules.component.html',
  styleUrls: ['./grid-rules.component.css'],
  providers: [RuleService]
})
export class GridRulesComponent implements OnInit {

  public GridData: GridDataResult = null;
  public GridPageSize: number = 10;
  public GridSkip: number = 0;


  @Input() SelectMultipleItem: Array<string>;

  @Output() SelectMultipleItemChange = new EventEmitter();

  @Output() Click = new EventEmitter();

  constructor(private ruleService: RuleService) {
    this.GridSkip = 0;
    this.GridReload();
  }

  ngOnInit() {
  }

  public pageChange(event: PageChangeEvent): void {
    this.GridSkip = event.skip;
    this.GridReload();
  }

  public GridReload() {
    this.ruleService.GetRuleTotCount(this.GridSkip, this.GridPageSize).subscribe(a => {
      this.GridData = {
        data: a.Data,
        total: a.Total
      };
    });
  }

  public AtualizaGrid() {
    if (this.SelectMultipleItem != null && this.SelectMultipleItem.length > 0 && confirm("Deseja limpar os filtro de validações já selecionado?")) {
      this.SelectMultipleItem = [];
      this.SelectMultipleItemChange.emit({ SelectMultipleItem: this.SelectMultipleItem, ItemAdd: false });
    }

    this.GridReload();
  }

  public SelectItem(Item: RuleTot, Select: boolean): void {
    if (this.SelectMultipleItem != null) {
      if (Select) {
        if (this.SelectMultipleItem.find(a => a == Item.TIR_ID) == null) {
          this.SelectMultipleItem.push(Item.TIR_ID);
          this.SelectMultipleItemChange.emit({ SelectMultipleItem: this.SelectMultipleItem, ItemAdd: true, Item });
        }
      }
      else {
        var idx = this.SelectMultipleItem.indexOf(Item.TIR_ID);
        if (idx !== -1) {
          this.SelectMultipleItem.splice(idx, 1);
          this.SelectMultipleItemChange.emit({ SelectMultipleItem: this.SelectMultipleItem, ItemAdd: false, Item });
        }
      }
    }
    else
      this.SelectMultipleItemChange.emit({ Item });
  }


  public ToogleSelectLine(Item: RuleTot): void {
    let Select = this.SelectMultipleItem.find(a => a == Item.TIR_ID) != null;
    this.SelectItem(Item, !Select);
  }
  public SelectionEvent(event) {
    this.SelectItem(this.GridData.data[event.index - this.GridSkip], event.selected);
  }
}
