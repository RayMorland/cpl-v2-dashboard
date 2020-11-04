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

@Component({
  selector: 'app-view-member-record-popup',
  templateUrl: './view-member-record-popup.component.html',
  styleUrls: ['./view-member-record-popup.component.scss']
})
export class ViewMemberRecordPopupComponent implements OnInit {
  private record: any;
  public invoiceReady = false;
  public editMode = false;
  public loaderOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMemberRecordPopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    if (this.data.isNew) {
      this.editMode = false;
      this.getData().subscribe((res) => {
        this.record = this.data.record;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    } else {
      this.editMode = true;
      this.getData().subscribe((res) => {
        this.record = this.data.record;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    }
  }

  private getData(): Observable<any> {
    const record = [];
    return forkJoin([record]);
  }
}
