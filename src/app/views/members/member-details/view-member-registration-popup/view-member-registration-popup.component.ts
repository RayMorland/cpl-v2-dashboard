import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { LeagueService } from "app/shared/services/league/league.service";
import { PlatformService } from "app/shared/services/platform/platform.service";
import { forkJoin, Observable } from "rxjs";
import { MeetsService } from "app/shared/services/meets/meets.service";
import { Meet } from "app/shared/models/meet.model";

@Component({
  selector: "app-view-member-registration-popup",
  templateUrl: "./view-member-registration-popup.component.html",
  styleUrls: ["./view-member-registration-popup.component.scss"],
})
export class ViewMemberRegistrationPopupComponent implements OnInit {
  private registration: any;
  public invoiceReady = false;
  public editMode = false;
  public loaderOpen = false;
  private meet: Meet;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMemberRegistrationPopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService,
    private meetService: MeetsService
  ) {}

  ngOnInit() {
    this.loaderOpen = true;
    this.registration = this.data.registration;
    this.getData().subscribe((res) => {
      this.changeDetectorRef.detectChanges();
      this.meet = res[0][0];
      this.loaderOpen = false;
    });
  }

  private getData(): Observable<any> {
    const meets = this.meetService.findMeet(this.registration.meetId._id);
    return forkJoin([meets]);
  }
}
