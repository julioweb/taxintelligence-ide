import { Component, OnInit } from '@angular/core';
import { viewParentEl } from '@angular/core/src/view/util';

@Component({
  selector: 'app-full-loading',
  templateUrl: './full-loading.component.html',
  styleUrls: ['./full-loading.component.css']
})
export class FullLoadingComponent implements OnInit {

  show: boolean = false;

  constructor() { }

  ngOnInit() { }

  showLoading() {
    this.show = true;
  }

  hideLoading() {
    this.show = false;
  }

}
