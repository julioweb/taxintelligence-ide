import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RuleService } from "../../services/data/rules/rule.service";
import { ServiceUtils } from "../../services/Utils/Utils"
import { DocumentsService } from '../../services/data/documents/documents.service';

import { DocumentModel, DocVersionModel } from '../../models/Documents';
import { RuleModelList, GroupRuleModel, RuleModel } from "../../models/RuleTot";
import { ModalAlertComponent } from '../../modais/modal-alert/modal-alert.component';
import { BsModalService } from 'ngx-bootstrap';
import { FullLoadingComponent } from '../../modais/full-loading/full-loading.component';

@Component({
  selector: 'cad-rule-group',
  templateUrl: './cad-rule-group.component.html',
  styleUrls: ['./cad-rule-group.component.css']
})
export class CadRuleGroupComponent implements OnInit, OnDestroy {

  _RelacDocsLst: Array<DocumentModel> = new Array<DocumentModel>();
  _RelacDocVersionLst: Array<DocVersionModel> = new Array<DocVersionModel>();
  bsUtils: ServiceUtils;
  grpObjt: GroupRuleModel;

  @Input() ruleGrpEditId: string;
  inscricao: Subscription;

  public hasName: boolean = true;
  public hasDesc: boolean = true;
  public hasDocVersion: boolean = true;

  @ViewChild('AvaibleRules') avaibleLstElmnt: ElementRef;
  @ViewChild('SelectedRules') selectLstElmnt: ElementRef;
  @ViewChild('fullLoading') fullLoading: FullLoadingComponent;

  _RuleList: Array<RuleModel> = new Array<RuleModel>();
  _AvaibleRuleList: Array<RuleModel> = new Array<RuleModel>();
  _SelectedList: Array<RuleModel> = new Array<RuleModel>();

  constructor(private bsRules: RuleService,
    public bsDocument: DocumentsService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router) {
    this.bsUtils = new ServiceUtils();
    this.grpObjt = new GroupRuleModel();

    this.grpObjt.ID = this.bsUtils.GetNewGuidId();
    // this.ruleGrpEditId = "DDB2CF45-3EB4-4DBB-B230-0AD6180C91BA";//route.snapshot.params["Id"];
  }


  ngOnInit() {
    this.inscricao = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.ruleGrpEditId = queryParams['id'];
      }
    );

    this.bsDocument.GetDocumentsList(0, 1000).subscribe(a => {
      this._RelacDocsLst = a.Data;
    });

    this.bsRules.GetRulesList(0, 1000).subscribe(a => {
      this._RuleList = a.Data;
      this._AvaibleRuleList = this._RuleList;
    });

    if (this.ruleGrpEditId != null && this.ruleGrpEditId != "") {
      this.LoadRuleGroup();
    }
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  private LoadRuleGroup() {
    this.bsRules.GetGroupRuleById(this.ruleGrpEditId).subscribe(a => {
      this.grpObjt = a;
      if (this.grpObjt.DocID != null && this.grpObjt.DocID != "") {
        this.GetVersionList(true);
      }
    });
  }

  private IsInputValid() {
    let isValid = true;
    this.hasName = this.grpObjt.Name != null && this.grpObjt.Name.trim() != "";
    this.hasDesc = this.grpObjt.Description != null && this.grpObjt.Description.trim() != "";
    this.hasDocVersion = this.grpObjt.DocVersionId != null && this.grpObjt.DocVersionId.trim() != "";
    isValid = this.hasDesc && this.hasName && this.hasDocVersion;
    return isValid;
  }
  onSubmit(): void {
    if (this.IsInputValid()) {
      this.fullLoading.showLoading();

      let isEdit = this.ruleGrpEditId != "" && this.ruleGrpEditId != null;
      this.grpObjt.RelacRules = this._SelectedList.map(a => { return a.RuleID });
      this.bsRules.SendRuleGroupPost(this.grpObjt, isEdit).subscribe(a => {
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
          this.router.navigate(['/rules-group']);
        }
      });
    }
  }
  /*************************************Document******************************************/
  GetVersionList(isLoad: boolean) {
    this.bsDocument.GetDocVersionList(this.grpObjt.DocID, 0, 1000).subscribe(a => {
      this._RelacDocVersionLst = a.Data;

      if (this.grpObjt.RelacRules != null && this.grpObjt.RelacRules.length > 0) {
        var idxArray: Array<string> = new Array<string>();

        for (var i = 0; i < this.grpObjt.RelacRules.length; i++) {
          var item = this._AvaibleRuleList.find(x => x.RuleID == this.grpObjt.RelacRules[i]);
          this._SelectedList.push(item);
          idxArray.push(item.RuleID);
        }

        if (idxArray.length == this._AvaibleRuleList.length) {
          this._AvaibleRuleList = new Array<RuleModel>();
        }
        else {
          for (var i = 0; i < idxArray.length; i++) {
            var remItem = this._AvaibleRuleList.find(x => x.RuleID == idxArray[i])
            let idxrem = this._AvaibleRuleList.indexOf(remItem);
            this._AvaibleRuleList.splice(idxrem, 1);
          }
        }
      }
    });
  }

  /*************************************Regras***********************************************/
  SetItemSelected(event, typeClick) {
    let className = " list-group-item-info";

    if (typeClick == "remove") {
      className = " list-group-item-danger";
    }

    if (event.target.className.indexOf(className.trim()) >= 0) {
      event.target.className = event.target.className.replace(className, "");
    }
    else {
      event.target.className = event.target.className + className;
    }
  }

  SelectItem(all: boolean) {
    if (all) {
      for (var i = 0; i < this._AvaibleRuleList.length; i++) {
        this._SelectedList.push(this._AvaibleRuleList[i]);
      }

      this._AvaibleRuleList = new Array<RuleModel>();
    }
    else {
      var childrenLst = this.avaibleLstElmnt.nativeElement.children;
      var idxArray: Array<string> = new Array<string>();

      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-info") >= 0) {
          var item = this._AvaibleRuleList[childrenLst[i].value];
          this._SelectedList.push(item);

          idxArray.push(item.RuleID);
        }
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-info", "");
      }
      for (var i = 0; i < idxArray.length; i++) {
        var remItem = this._AvaibleRuleList.find(x => x.RuleID == idxArray[i])
        let idxrem = this._AvaibleRuleList.indexOf(remItem);
        this._AvaibleRuleList.splice(idxrem, 1);
        //this._AvaibleRuleList.splice(idxArray[i], 1);
      }
    }
  }

  UnselectItem(all: boolean) {
    if (all) {
      for (var i = 0; i < this._SelectedList.length; i++) {
        this._AvaibleRuleList.push(this._SelectedList[i]);
      }
      this._SelectedList = new Array<RuleModel>();
    }
    else {
      var childrenLst = this.selectLstElmnt.nativeElement.children;
      var idxArray: Array<string> = new Array<string>();
      for (var i = 0; i < childrenLst.length; i++) {
        if (childrenLst[i].className.indexOf("list-group-item-danger") >= 0) {
          var item = this._SelectedList[childrenLst[i].value];
          this._AvaibleRuleList.push(item);
          idxArray.push(item.RuleID);
        }
        childrenLst[i].className = childrenLst[i].className.replace(" list-group-item-danger", "");
      }
      for (var i = 0; i < idxArray.length; i++) {
        var remItem = this._SelectedList.find(x => x.RuleID == idxArray[i])
        let idxrem = this._SelectedList.indexOf(remItem);
        this._SelectedList.splice(idxrem, 1);
        //this._SelectedList.splice(childrenLst[i].value, 1);
      }
    }
  }
}
