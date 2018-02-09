import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApproveDocComponent } from './modal-approve-doc.component';

describe('ModalApproveDocComponent', () => {
  let component: ModalApproveDocComponent;
  let fixture: ComponentFixture<ModalApproveDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApproveDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApproveDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
