import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { ViewCoordinatorInvoiceComponent } from './view-coordinator-invoice.component';

describe('ViewCoordinatorInvoiceComponent', () => {
  let component: ViewCoordinatorInvoiceComponent;
  let fixture: ComponentFixture<ViewCoordinatorInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ ViewCoordinatorInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoordinatorInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
