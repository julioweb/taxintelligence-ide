import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  myRoute: any;

  currentYear = new Date().getFullYear();
  constructor(private router: Router) {
    this.myRoute = router;
  }
}
