import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { ViewCoordinatorMeetComponent } from './view-coordinator-meet.component';

describe('ViewCoordinatorMeetComponent', () => {
  let component: ViewCoordinatorMeetComponent;
  let fixture: ComponentFixture<ViewCoordinatorMeetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ ViewCoordinatorMeetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoordinatorMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
