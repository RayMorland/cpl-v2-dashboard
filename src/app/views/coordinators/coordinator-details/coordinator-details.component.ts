import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { share } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { ViewCoordinatorMeetComponent } from './view-coordinator-meet/view-coordinator-meet.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewCoordinatorInvoiceComponent } from './view-coordinator-invoice/view-coordinator-invoice.component';

@Component({
  selector: 'app-coordinator-details',
  templateUrl: './coordinator-details.component.html',
  styleUrls: ['./coordinator-details.component.scss'],
  animations: [egretAnimations]
})
export class CoordinatorDetailsComponent implements OnInit {
  coordinatorId: string;
  coordinatorReady = false;
  coordinatorObs: Observable<any>;
  coordinator: any;
  info: any;
  coordinatorMeets: Coordinator[] = [];
  coordinatorMeetsColumns: string[] = ['id', 'meet_title', 'status', 'actions'];

  constructor(
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private coordinatorService: CoordinatorsService,
    private changeDetectorRef: ChangeDetectorRef,
    private meetService: MeetsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loader.open();
    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.coordinatorId = params.id;
          this.getData().subscribe(res => {
            this.coordinator = res[0];
            this.coordinatorMeets = this.coordinator.meets;
            console.log(this.coordinator);
            this.loader.close();
            this.coordinatorReady = true;
            this.changeDetectorRef.detectChanges();
          });
        } else {
        }
      }
    );
  }

  private getData(): Observable<any> {
    const coordinator = this.coordinatorService.findCoordinator(this.coordinatorId);
    return forkJoin([coordinator]);
  }

  deleteCoordinator(){
    
  }

  public openViewCoordinatorMeetPopUp(data: any = {}, isNew?) {
    let title = "Meet";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewCoordinatorMeetComponent,
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

  public openViewCoordinatorInvoicePopUp(data: any = {}, isNew?) {
    let title = "Meet";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ViewCoordinatorInvoiceComponent,
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
}
