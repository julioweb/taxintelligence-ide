import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDocVersionComponent } from './grid-doc-version.component';

describe('GridDocVersionComponent', () => {
  let component: GridDocVersionComponent;
  let fixture: ComponentFixture<GridDocVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDocVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDocVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
