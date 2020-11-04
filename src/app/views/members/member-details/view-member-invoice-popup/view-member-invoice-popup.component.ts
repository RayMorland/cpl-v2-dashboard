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
  selector: 'app-view-member-invoice-popup',
  templateUrl: './view-member-invoice-popup.component.html',
  styleUrls: ['./view-member-invoice-popup.component.scss']
})
export class ViewMemberInvoicePopupComponent implements OnInit {
  private invoice: any;
  public invoiceReady = false;
  public editMode = false;
  public loaderOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMemberInvoicePopupComponent>,
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
        this.invoice = this.data.invoice;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    } else {
      this.editMode = true;
      this.getData().subscribe((res) => {
        this.invoice = this.data.invoice;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    }
  }

  private getData(): Observable<any> {
    const invoice = [];
    return forkJoin([invoice]);
  }
}
