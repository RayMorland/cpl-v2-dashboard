import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { MeetRequestsPopupComponent } from './meet-requests-popup.component';

describe('MeetRequestsPopupComponent', () => {
  let component: MeetRequestsPopupComponent;
  let fixture: ComponentFixture<MeetRequestsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ MeetRequestsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetRequestsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
