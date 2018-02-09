import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocprcAprovacaoComponent } from './docprc-aprovacao.component';

describe('DocprcAprovacaoComponent', () => {
  let component: DocprcAprovacaoComponent;
  let fixture: ComponentFixture<DocprcAprovacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocprcAprovacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocprcAprovacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
