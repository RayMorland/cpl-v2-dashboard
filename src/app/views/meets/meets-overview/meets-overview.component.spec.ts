import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { MeetsOverviewComponent } from './meets-overview.component';

describe('MeetsOverviewComponent', () => {
  let component: MeetsOverviewComponent;
  let fixture: ComponentFixture<MeetsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ MeetsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
