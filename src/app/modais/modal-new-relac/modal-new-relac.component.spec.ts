import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewRelacComponent } from './modal-new-relac.component';

describe('ModalNewRelacComponent', () => {
  let component: ModalNewRelacComponent;
  let fixture: ComponentFixture<ModalNewRelacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewRelacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewRelacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
