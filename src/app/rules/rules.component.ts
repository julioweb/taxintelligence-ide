import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import { RuleModelList } from "../models/RuleTot";
import { RuleService } from "../services/data/rules/rule.service";
import { FullLoadingComponent } from '../modais/full-loading/full-loading.component';
import { ModalAlertComponent } from '../modais/modal-alert/modal-alert.component';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { ModalLoteRuleComponent } from '../modais/modal-lote-rule/modal-lote-rule.component';

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
  @ViewChild('xlsNewRule') xlsNewRule:ElementRef;

  curSubscribe: Subscription;
  constructor(private bsRules: RuleService, 
    private modalService: BsModalService,
    private router: Router) {
    this.GridSkip = 0;
    this.GridReload();
  }

  ngOnInit() {
    this.fullLoading.showLoading();
   }
  /************************************************************************** Upload Excel *******************************************************************************/
   AddFromXls(){
    // let event = new MouseEvent('click', {bubbles: false});
    // this.xlsNewRule.nativeElement.dispatchEvent(event);
    let modalConfig = {
      keyboard: false,
      ignoreBackdropClick: true,
      modalService: this.modalService
    };

    this.modalService.show(ModalLoteRuleComponent, modalConfig);

    this.curSubscribe = this.modalService.onHidden.subscribe(result => {
      if (result != undefined && result != "") {
        let alertMessage = JSON.parse(result);
        this.modalService.show(ModalAlertComponent, { initialState: alertMessage });
      }
      this.curSubscribe.unsubscribe();
    });
  }

  NewRuleXlsSelected(event: any) {
    if (event.target.files != null && event.target.files.length > 0) {
      this.fullLoading.showLoading();
      let file: File = event.target.files[0];
      if (file.name.endsWith("xlsx") || file.name.endsWith("xlx")) {
        this.bsRules.SendNewRuleXlsToApi(file,'','').subscribe(a => {
          if (a.Status) {
            this.AtualizaGrid();
          }
          else {
            let alertState = {
              Message: "Deu um erro no servidor",
              title: "Opsss!!! ¬¬",
              alertType: "danger"
            };

            if(a != undefined)
            {
              alertState.Message = a.Message;
            }
            this.modalService.show(ModalAlertComponent, { initialState: alertState });
          }

          this.fullLoading.hideLoading();
        }, err => {
          let alertState = {
            Message: "Não foi possível, pegamos um erro não tratado!",
            title: "Opsss!!! ¬¬",
            alertType: "danger"
          };
          this.modalService.show(ModalAlertComponent, { initialState: alertState });
          this.fullLoading.hideLoading();
        });
      }
      else{
        let alertState = {
          Message: "Arquivo não suportado, selecione .xlx,.xlsx",
          title: "Aí não né !!!",
          alertType: "info"
        };
        this.modalService.show(ModalAlertComponent, { initialState: alertState });
        this.fullLoading.hideLoading();
      }
    }
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
