import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDocumentsComponent } from './grid-documents.component';

describe('GridDocumentsComponent', () => {
  let component: GridDocumentsComponent;
  let fixture: ComponentFixture<GridDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
