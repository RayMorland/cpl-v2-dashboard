import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { RecordsOverviewComponent } from './records-overview.component';

describe('RecordsOverviewComponent', () => {
  let component: RecordsOverviewComponent;
  let fixture: ComponentFixture<RecordsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ RecordsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
