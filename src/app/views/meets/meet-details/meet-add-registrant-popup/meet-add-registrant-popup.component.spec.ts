import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { SharedModule } from "app/shared/shared.module";

import { MeetAddRegistrantPopupComponent } from "./meet-add-registrant-popup.component";

describe("MeetAddRegistrantPopupComponent", () => {
  let component: MeetAddRegistrantPopupComponent;
  let fixture: ComponentFixture<MeetAddRegistrantPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [MeetAddRegistrantPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetAddRegistrantPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
