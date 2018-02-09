import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRulesComponent } from './grid-rules.component';

describe('GridRulesComponent', () => {
  let component: GridRulesComponent;
  let fixture: ComponentFixture<GridRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
