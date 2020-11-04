import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { ViewMemberResultPopupComponent } from './view-member-result-popup.component';

describe('ViewMemberResultPopupComponent', () => {
  let component: ViewMemberResultPopupComponent;
  let fixture: ComponentFixture<ViewMemberResultPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ ViewMemberResultPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMemberResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
