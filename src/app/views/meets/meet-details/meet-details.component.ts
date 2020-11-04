import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MeetsService } from "app/shared/services/meets/meets.service";
import { egretAnimations } from "app/shared/animations/egret-animations";
import { Observable, forkJoin } from "rxjs";
import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { MeetAddRegistrantPopupComponent } from "./meet-add-registrant-popup/meet-add-registrant-popup.component";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { Registration } from "app/shared/models/registration.model";
import { Membership } from "app/shared/models/membership.model";
import { Member } from "app/shared/models/member.model";
import { MembersService } from "app/shared/services/members/members.service";
import { MeetResultsPopupComponent } from "./meet-results-popup/meet-results-popup.component";
import { Result } from "app/shared/models/result.model";
import { ResultsService } from "app/shared/services/results/results.service";
import {
  GoogleMapsAPIWrapper,
  AgmMap,
  LatLngBounds,
  LatLngBoundsLiteral,
  MapsAPILoader,
} from "@agm/core";
import { RegistrationService } from "app/shared/services/registrations/registration.service";
import { MeetResultEditPopupComponent } from "./meet-result-edit-popup/meet-result-edit-popup.component";
import { ColumnMode } from "@swimlane/ngx-datatable";

declare var google: any;

@Component({
  selector: "app-meet-details",
  templateUrl: "./meet-details.component.html",
  styleUrls: ["./meet-details.component.scss"],
  animations: [egretAnimations],
})
export class MeetDetailsComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  meetId: string;
  meetObs: Observable<any>;
  meetInfo: any;
  meetObject: any;
  meetReady = false;
  meet: any;
  dataLoaded: Promise<boolean>;
  registrations: Registration[] = [];
  members: Member[] = [];
  results: Result[] = [];

  registrantsReady = false;
  private resultsReady = false;
  private resultsFilename = '';
  private resultsDisplayedColumns = ["name"];
  ColumnMode = ColumnMode;

  pending = [];
  groups = [];

  editing = {};

  private selectedImage: string;

  private geoCoder;
  private mapReady = false;
  zoom = 15;
  mapCenter = {
    lat: 49.886422,
    lng: -119.476738,
  };
  polylinePoints = [
    { lat: 24.847916, lng: 89.369764 },
    { lat: 23.806921, lng: 90.377078 },
    { lat: 24.919298, lng: 91.831699 },
  ];
  circleMapRadius = 50000;

  constructor(
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private meetService: MeetsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private membersService: MembersService,
    private resultsService: ResultsService,
    private mapsApiLoader: MapsAPILoader,
    private _snackBar: MatSnackBar,
    private registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.loader.open();
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty("id")) {
        this.meetId = params.id;
        this.getData().subscribe(
          (res) => {
            this.loader.close();
            this.meet = res[0][0];
            if (this.meet.resultsDocumentUrl) {
              this.resultsFilename = this.meet.resultsDocumentUrl.substring(
                this.meet.resultsDocumentUrl.lastIndexOf("/") + 1
              );
            }
            this.selectedImage = this.meet.images[0];
            this.mapsApiLoader.load().then(() => {
              this.geoCoder = new google.maps.Geocoder();
              this.getLocation();
            });
            this.registrations = res[1];
            this.members = res[2];
            this.results = res[3];
            console.log(this.results);
            this.resultsReady = true;
            this.meetReady = true;
            this.registrantsReady = true;
            this.changeDetectorRef.detectChanges();
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
      }
    });
  }

  // Get data required for component. Returns [meets, registrants, members, results]
  private getData(): Observable<any> {
    // const league = this.leagueService.getLeague();
    const meet = this.meetService.findMeet(this.meetId);
    const members = this.membersService.getMembers();
    const registrants = this.meetService.getMeetRegistrants(this.meetId);
    const results = this.meetService.getMeetResults(this.meetId);
    return forkJoin([meet, registrants, members, results]);
  }

  // Change the meet status to the supplied value
  private changeMeetStatus(status: string): void {
    this.loader.open();
    this.meetReady = false;
    this.meetService.changeMeetStatus(this.meet._id, status).subscribe(
      (res) => {
        this.loader.close();
        this.meet = res;
        this.meetReady = true;
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Open meet registration
  private openRegistration(): void {
    this.loader.open();
    this.meetReady = false;
    this.meetService.changeRegistrationOpen(this.meet._id, true).subscribe(
      (res) => {
        this.loader.close();
        this.meet = res;
        this.meetReady = true;
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Close the meets registration
  private closeRegistration(): void {
    this.loader.open();
    this.meetReady = false;
    this.meetService.changeRegistrationOpen(this.meet._id, false).subscribe(
      (res) => {
        this.loader.close();
        this.meet = res;
        this.meetReady = true;
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Get the meet location coordinates for google maps using geoCoder
  private getLocation(): void {
    const address =
      this.meet.venue.location.address.city +
      " " +
      this.meet.venue.location.address.province;
    this.geoCoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        this.mapCenter = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.mapReady = true;
        this.changeDetectorRef.detectChanges();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  // Cycle through the mee images carousel
  private changeMeetImage(image: string): void {
    this.selectedImage = this.meet.images[image];
  }

  // Open registration add new or edit popup
  public openRegistrationPopUp(data: any = {}, isNew?): void {
    let title = isNew ? "new" : "update";
    let meet = this.meet;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      MeetAddRegistrantPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, meet: meet, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((registration) => {
      if (!registration) {
        // If user press cancel
        return;
      }
      this.registrantsReady = false;
      this.meetService
        .getMeetRegistrants(this.meetId)
        .subscribe((registrants) => {
          this.registrations = registrants;
          if (isNew) {
            this.registrantsReady = true;
            this.changeDetectorRef.detectChanges();
            const message = registration.name + "'s registration added";
            const action = "close";
            this._snackBar.open(message, action, {
              duration: 2000,
            });
          } else {
            this.registrantsReady = true;
            this.changeDetectorRef.detectChanges();
            const message = registration.name + "'s registration updated";
            const action = "close";
            this._snackBar.open(message, action, {
              duration: 2000,
            });
          }
        });
    });
  }

  // Delete registration
  public deleteRegistration(row): void {
    this.confirmService
      .confirm({ message: `Delete ${row.name}?` })
      .subscribe((res) => {
        if (res) {
          this.registrantsReady = false;
          this.registrationService
            .deleteRegistration(row._id)
            .subscribe((res) => {
              this.meetService
                .getMeetRegistrants(this.meetId)
                .subscribe((res) => {
                  this.registrations = res;
                  this.registrantsReady = true;
                  this.changeDetectorRef.detectChanges();
                  let message = row.name + " registration deleted";
                  let action = "close";
                  this._snackBar.open(message, action, {
                    duration: 2000,
                  });
                });
            });
        }
      });
  }

  // Open results file upload popup
  public openResultsUploadPopUp(data: any = {}, isNew?): void {
    let title = isNew ? "Add new member" : "Update member";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      MeetResultsPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, meet: this.meet, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.resultsReady = false;
      this.loader.open();
      this.getData().subscribe((res) => {
        this.meet = res[0][0];
        this.results = res[3];
        console.log(this.meet);
        this.resultsFilename = this.meet.resultsDocumentUrl.substring(
          this.meet.resultsDocumentUrl.lastIndexOf("/") + 1
        );
        this.loader.close();
        this.resultsReady = true;
        this.changeDetectorRef.detectChanges();
        let message = "Results file uploaded";
        let action = "close";
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      });
    });
  }

  // Open Results Edit Popup
  public openResultEditPopUp(data: any = {}, isNew?): void {
    let title = isNew ? "Add new Result" : "Update Result";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      MeetResultEditPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, meet: this.meet, result: data, registrants: this.registrations },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
      this.resultsReady = false;
      this.meetService.getMeetResults(this.meetId).subscribe((results) => {
        this.results = results;
        if (isNew) {
          this.resultsReady = true;
          this.changeDetectorRef.detectChanges();
          const message = result.memberName + "'s result added";
          const action = "close";
          this._snackBar.open(message, action, {
            duration: 2000,
          });
        } else {
          this.resultsReady = true;
          this.changeDetectorRef.detectChanges();
          const message = result.name + "'s result updated";
          const action = "close";
          this._snackBar.open(message, action, {
            duration: 2000,
          });
        }
      });
    });
  }

  // Delete result
  public deleteResult(row): void {
    this.confirmService
      .confirm({ message: `Delete ${row.name}?` })
      .subscribe((res) => {
        if (res) {
          this.resultsService.deleteResult(row).subscribe((res) => {
            this.resultsReady = false;
            this.meetService
              .getMeetResults(this.meetId)
              .subscribe((results) => {
                this.results = results;
                console.log(results);
                this.resultsReady = true;
                this.changeDetectorRef.detectChanges();
                let message = row._id + " result deleted";
                let action = "close";
                this._snackBar.open(message, action, {
                  duration: 2000,
                });
              });
          });
        }
      });
  }

  // Call api to create current registration spreadsheet in S3 and get the url to download file
  public downloadRegistrationSpreadsheet(): void {
    this.registrationService.createRegistrationSpreadsheet(this.meetId).subscribe(res => {
      console.log(res);
      window.open(res.Location);
    }, err => {
      console.log(err);
    });
  }
}
