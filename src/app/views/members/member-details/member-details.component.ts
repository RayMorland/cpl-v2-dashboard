import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { MembersService } from "app/shared/services/members/members.service";
import { egretAnimations } from "app/shared/animations/egret-animations";
import { share } from "rxjs/operators";
import { Observable, forkJoin } from "rxjs";
import { PaymentsService } from "app/shared/services/payments/payments.service";
import { RegistrationService } from "app/shared/services/registrations/registration.service";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar,
  MatTableDataSource,
} from "@angular/material";
import { Member } from "app/shared/models/member.model";
import { Record } from "app/shared/models/record.model";
import { Registration } from "app/shared/models/registration.model";
import { Result } from "app/shared/models/result.model";
import { MeetsService } from "app/shared/services/meets/meets.service";
import { ViewMemberInvoicePopupComponent } from "./view-member-invoice-popup/view-member-invoice-popup.component";
import { ViewMemberRecordPopupComponent } from "./view-member-record-popup/view-member-record-popup.component";
import { ViewMemberRegistrationPopupComponent } from "./view-member-registration-popup/view-member-registration-popup.component";
import { ViewMemberResultPopupComponent } from "./view-member-result-popup/view-member-result-popup.component";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.scss"],
  animations: [egretAnimations],
})
export class MemberDetailsComponent implements OnInit, AfterViewInit {
  memberId: string;
  memberReady = false;
  memberObs: Observable<any>;
  memberInfo: any;
  info: any;
  member: any;
  memberRecords: any;
  memberResults: any;
  memberRegistrations: any;
  memberBilling: any;

  billingDisplayedColumns: string[] = ["id", "amount_due", "status", "actions"];
  billingDataSource: any;

  registrationsDisplayedColumns: string[] = ["meet_title", "status", "actions"];
  registrationsDataSource: any;

  recordsDisplayedColumns: string[] = ["id", "actions"];
  recordsDataSource: any;

  resultsDisplayedColumns: string[] = ["id", "actions"];
  resultsDataSource: any;

  @ViewChild("recordsPaginator", { static: false })
  recordsPaginator: MatPaginator;
  @ViewChild("billingPaginator", { static: false })
  billingPaginator: MatPaginator;
  @ViewChild("resultsPaginator", { static: false })
  resultsPaginator: MatPaginator;
  @ViewChild("registrationsPaginator", { static: false })
  registrationsPaginator: MatPaginator;

  constructor(
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MembersService,
    private registrationService: RegistrationService,
    private changeDetectorRef: ChangeDetectorRef,
    private paymentService: PaymentsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private meetService: MeetsService
  ) {}

  ngOnInit() {
    this.loader.open();
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty("id")) {
        this.memberId = params.id;
        console.log(this.memberId);
        this.getData().subscribe((res) => {
          this.member = res[0];
          console.log(res);
          this.memberBilling = res[4].data;
          this.memberResults = res[1];
          this.memberRecords = res[2];
          this.memberRegistrations = res[3];
          this.registrationsDataSource = new MatTableDataSource<Registration>(
            this.memberRegistrations
          );
          this.recordsDataSource = new MatTableDataSource<Record>(
            this.memberRecords
          );
          this.resultsDataSource = new MatTableDataSource<Result>(
            this.memberResults
          );
          this.billingDataSource = new MatTableDataSource<Result>(
            this.memberBilling
          );
          this.loader.close();
          this.info = res;
          this.memberReady = true;

          console.log(this.recordsDataSource);
          this.changeDetectorRef.detectChanges();
          this.recordsDataSource.paginator = this.recordsPaginator;
          this.resultsDataSource.paginator = this.resultsPaginator;
          this.registrationsDataSource.paginator = this.registrationsPaginator;
          this.billingDataSource.paginator = this.billingPaginator;
        });
      } else {
      }
    });
  }

  ngAfterViewInit() {}

  public getData(): Observable<any> {
    const member = this.memberService.findMember({ _id: this.memberId });
    const results = this.memberService.getMembersResults(this.memberId);
    const records = this.memberService.getMembersRecords(this.memberId);
    const registrations = this.memberService.getMembersRegistrations(
      this.memberId
    );
    const invoices = this.paymentService.getMembersInvoices(this.memberId);
    return forkJoin([member, results, records, registrations, invoices]);
  }

  public deleteMember(): void {
    this.loader.open();
    this.memberService.deleteMember(this.member).subscribe((res) => {
      console.log(res);
      this.loader.close();
      this.router.navigate(["/members"]);
    });
  }

  public suspendMember(): void {}

  public removeRegistration(id: string): void {
    console.log(id);
    this.loader.open();
    this.registrationService.deleteRegistration(id).subscribe((res) => {
      this.memberService
        .getMembersRegistrations(this.memberId)
        .subscribe((res) => {
          this.memberRegistrations = res;
          this.registrationsDataSource = this.memberRegistrations;
          this.loader.close();
          this.changeDetectorRef.detectChanges();
        });
    });
  }

  filterRegistrations(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.registrationsDataSource.filter = filterValue.trim().toLowerCase();
  }
  filterRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.recordsDataSource.filter = filterValue.trim().toLowerCase();
  }
  filterResults(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.resultsDataSource.filter = filterValue.trim().toLowerCase();
  }
  filterInvoices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.billingDataSource.filter = filterValue.trim().toLowerCase();
  }

  public openViewRegistrationPopup() {}

  public openViewMemberInvoicePopUp(data: any = {}, isNew?) {
    let title = "Invoice";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewMemberInvoicePopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, invoice: data },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
    });
  }

  public openViewMemberRecordPopUp(data: any = {}, isNew?) {
    let title = "Record";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewMemberRecordPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, record: data },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
    });
  }

  public openViewMemberRegistrationPopUp(data: any = {}, isNew?) {
    let title = "Registration";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewMemberRegistrationPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, registration: data },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
    });
  }

  public openViewMemberResultPopUp(data: any = {}, isNew?) {
    let title = "Results";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewMemberResultPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, result: data },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
    });
  }
}
