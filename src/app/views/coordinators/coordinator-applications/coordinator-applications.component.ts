import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Record } from 'app/shared/models/record.model';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { League } from 'app/shared/models/league.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { forkJoin, Observable } from 'rxjs';
import { CoordinatorApplicationPopupComponent } from './coordinator-application-popup/coordinator-application-popup.component';
import { CoordinatorApplication } from 'app/shared/models/coordinator-application.model';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { CoordinatorApplicationsService } from 'app/shared/services/coordinator-applications/coordinator-applications.service';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';

@Component({
  selector: 'app-coordinator-applications',
  templateUrl: './coordinator-applications.component.html',
  styleUrls: ['./coordinator-applications.component.scss'],
  animations: [egretAnimations]
})
export class CoordinatorApplicationsComponent implements OnInit {
  public currentPage: any;
  public error: string;

  public applications: CoordinatorApplication[];
  public refinedApplications: CoordinatorApplication[];
  public formReady = false;
  public applicationSearchForm: FormGroup;
  public applicationsReady = false;
  public league: League;
  public coordinators: Coordinator[];

  public refinedapplications: Record[];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private applicationsService: CoordinatorApplicationsService,
    private coordinatorService: CoordinatorsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private leagueService: LeagueService
  ) // private crudService: CrudService,
  // private confirmService: AppConfirmService,
  {}

  ngOnInit() {
    this.initForm();
    this.getData().subscribe(
      res => {
        this.applications = res[0].filter(coordinator => {
          if (coordinator.status === 'pending' || coordinator.status === 'rejected') {
            return coordinator;
          }
          return;
        });
        this.refinedApplications = this.applications;
        console.log(this.applications);
        this.league = res[1][0];
        this.loader.close();
        this.applicationsReady = true;
        this.setFormValues();
        this.changeDetectorRef.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {}

  private getData(): Observable<any> {
    // const league = this.leagueService.getLeague();
    const applications = this.coordinatorService.getCoordinators();
    const league = this.leagueService.getLeague();
    return forkJoin([applications, league]);
  }

  private onFormChanges(): void {
    this.applicationSearchForm.valueChanges.subscribe(val => {
      this.filterApplications(this.applicationSearchForm.value);
    });
  }

  private filterApplications(searchedApplications: any): void {
    let sortedApplications = [];
    let isMatch: boolean;

    for (let i = 0; i < this.applications.length; i++) {
      isMatch = false;
      if (true) {
        for (const property in searchedApplications) {
          if (true) {
            if (this.applications[i].hasOwnProperty(property)) {
              if (
                searchedApplications[property] === 'all' ||
                this.applications[i][property] ===
                  searchedApplications[property]
              ) {
                isMatch = true;
              } else {
                isMatch = false;
                break;
              }
            } else if (searchedApplications[property] === 'all') {
              isMatch = true;
            } else {
              isMatch = false;
              break;
            }
          }
        }
        if (isMatch === true) {
          sortedApplications.push(this.applications[i]);
        }
      }
    }
    this.refinedapplications = sortedApplications;
  }

  public clearSearch(): void {
    this.applicationSearchForm.patchValue({
      coordinator: 'all'
    });
  }

  private setFormValues() {}

  private initForm() {
    this.loader.close();
    this.formReady = true;

    this.applicationSearchForm = this.fb.group({
      coordinator: ['', Validators.required]
    });
    this.onFormChanges();
  }

  openPopUp(data: any, isNew?) {
    let title = isNew ? 'Add New Record' : 'Update Record';
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      CoordinatorApplicationPopupComponent,
      {
        width: '720px',
        disableClose: true,
        data: { title: title, payload: data, editMode: !isNew }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.formReady = false;
      if (isNew) {
        console.log('new');
        this.getData().subscribe(res => {
          this.applications = res[0].filter(coordinator => {
            if (
              coordinator.status === 'pending' ||
              coordinator.status === 'rejected'
            ) {
              return coordinator;
            }
          });
          this.refinedApplications = this.applications;
          this.loader.close();
          this.formReady = true;
          this.snack.open('Application Added!', 'OK', { duration: 4000 });
          this.changeDetectorRef.detectChanges();
        });
      } else {
        console.log('update');
        this.getData().subscribe(res => {
          this.applications = res[0].filter(coordinator => {
            if (
              coordinator.status === 'pending' ||
              coordinator.status === 'rejected'
            ) {
              return coordinator;
            }
          });
          this.refinedApplications = this.applications;
          this.loader.close();
          this.formReady = true;
          this.snack.open('Application Updated!', 'OK', { duration: 4000 });
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }
}
