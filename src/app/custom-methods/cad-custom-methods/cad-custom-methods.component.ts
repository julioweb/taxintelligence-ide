import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CustomQueryModel } from '../../models/CustomQueries';
import { FullLoadingComponent } from '../../modais/full-loading/full-loading.component';
import { CustomMethodsService } from '../../services/data/custom-methods/custom-methods.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceUtils } from '../../services/Utils/Utils';
import { ModalAlertComponent } from '../../modais/modal-alert/modal-alert.component';
import { BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'app-cad-custom-methods',
  templateUrl: './cad-custom-methods.component.html',
  styleUrls: ['./cad-custom-methods.component.css']
})
export class CadCustomMethodsComponent implements OnInit, OnDestroy {

  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;
  @Input() cqrEditId: string;

  bsUtils: ServiceUtils;
  cqrObjt: CustomQueryModel;
  inscricao: Subscription;

  public hasName: boolean = true;
  public hasDesc: boolean = true;
  public hasQuery: boolean = true;
  public hasParams: boolean = true;

  constructor(private bsCustomMethods: CustomMethodsService, private route: ActivatedRoute, private router: Router,private modalService: BsModalService,) {
    this.bsUtils = new ServiceUtils();
    this.cqrObjt = new CustomQueryModel();

    this.cqrObjt.ID = this.bsUtils.GetNewGuidId();
   }

  ngOnInit() {
    this.inscricao = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.cqrEditId = queryParams['id'];
      }
    );

    if (this.cqrEditId != null && this.cqrEditId != "") {
      this.LoadCustomQuery();
    }
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  private LoadCustomQuery() {
    this.bsCustomMethods.GetCustomQueryById(this.cqrEditId).subscribe(a => {
      this.cqrObjt = a;
    });
  }

  private IsInputValid() {
    let isValid = true;
    this.hasName = this.cqrObjt.Name != null && this.cqrObjt.Name.trim() != "";
    this.hasDesc = this.cqrObjt.Desc != null && this.cqrObjt.Desc.trim() != "";
    this.hasParams = this.cqrObjt.TotParams != null && this.cqrObjt.TotParams.toString().trim() != "" && this.cqrObjt.TotParams >= 0;
    this.hasQuery  = this.cqrObjt.StrQuery != null && this.cqrObjt.StrQuery.trim() != "";
    isValid = this.hasDesc && this.hasName && this.hasParams && this.hasQuery;
    return isValid;
  }

  onSubmit(): void {
    
    if (this.IsInputValid()) {
      this.fullLoading.showLoading();

      let isEdit = this.cqrEditId != "" && this.cqrEditId != null;
      this.bsCustomMethods.SendCustomQueryPost(this.cqrObjt, isEdit).subscribe(a => {
        let alertState = {
          Message: `O registro foi salvo com sucesso`,
          title: "Alteração Efetuada!",
          alertType: "success"
        };

        if (a != "OK") {
          alertState.title = "Ops!!"
          if (a.indexOf("23 - ") == 0) {
            alertState.Message = a.replace("23 - ", "");
            alertState.alertType = "info";
          }
          else {
            if (a == "serverError" || a == "ERRO") {
              alertState.Message = "Ocorreu um erro ao tentar salvar o item, tente novamente mais tarde!";
            }
            else {
              alertState.Message = a;
            }
            alertState.alertType = "danger";
          }
        }

        this.fullLoading.hideLoading();
        this.modalService.show(ModalAlertComponent, { initialState: alertState });
        if(a== "OK"){
          this.router.navigate(['/custom-method']);
        }
      });
    }
  }

}
