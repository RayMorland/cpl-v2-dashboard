import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Record } from 'app/shared/models/record.model';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, Router } from '@angular/router';
import { League } from 'app/shared/models/league.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { Observable, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { CoordinatorApplication } from 'app/shared/models/coordinator-application.model';
import { CoordinatorApplicationsService } from 'app/shared/services/coordinator-applications/coordinator-applications.service';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';

@Component({
  selector: 'app-coordinator-application-popup',
  templateUrl: './coordinator-application-popup.component.html',
  styleUrls: ['./coordinator-application-popup.component.scss'],
  animations: [egretAnimations]
})
export class CoordinatorApplicationPopupComponent implements OnInit {
  public coordinatorApplicationForm: FormGroup;
  public formReady = false;
  public editMode = false;
  public applications: Coordinator[];
  public application: Coordinator;
  public league: League;

  filteredMembers: Observable<string[]>;
  filteredMeets: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CoordinatorApplicationPopupComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private coordinatorsApplicationsService: CoordinatorApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private coordinatorService: CoordinatorsService
  ) {}

  ngOnInit() {
    this.getData().subscribe(res => {
      this.editMode = this.data.editMode;
      console.log(res);
      this.applications = res[0].filter(coordinator => {
        if (coordinator.status === 'pending' || coordinator.status === 'rejected') {
          return coordinator;
        }
        return;
      });
      this.league = res[1];
      this.initForm();
      if (this.editMode) {
        this.application = this.data.payload;
        this.setFormValues();
      }
      this.formReady = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  private getData(): Observable<any> {
    const applications = this.coordinatorService.getCoordinators();
    const league = this.leagueService.getLeague();
    return forkJoin([applications, league]);
  }

  private setValues() {}

  private onFormChanges(): void {
    this.coordinatorApplicationForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  private _filter(value: string, control: string): any {
    const filterValue = value.toLowerCase();

    // if (control === 'name') {
    //   return this.members.filter(member => member._id.toLowerCase().includes(filterValue));
    // } else if (control === 'meet') {
    //   return this.meets.filter(meet => meet._id.toLowerCase().includes(filterValue));
    // }
  }

  private initForm() {
    this.coordinatorApplicationForm = this.fb.group({
      status: ['', Validators.required]
    });
    this.onFormChanges();
  }

  private setFormValues() {
    this.coordinatorApplicationForm.patchValue({
      name: this.application.name,
      email: this.application.email
    });
  }

  public submitForm(): void {
    const coordinatorApp = this.coordinatorApplicationForm.value;
    if (this.coordinatorApplicationForm.controls['status'].value === true) {
      coordinatorApp.status = 'active';
    } else {
      coordinatorApp.status = 'pending';
    }
    console.log(coordinatorApp);
    if (this.editMode) {
      this.coordinatorService
        .updateCoordinator(
          this.application._id,
          coordinatorApp
        )
        .subscribe(
          res => {
            this.dialogRef.close(this.coordinatorApplicationForm.value);
          },
          err => {
            console.log(err);
          },
          () => {}
        );
    } else {
      this.coordinatorsApplicationsService
        .createCoordinatorApplication(this.coordinatorApplicationForm.value)
        .subscribe(
          res => {
            this.dialogRef.close(this.coordinatorApplicationForm.value);
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  public reject(): void {
    const coordinatorApp = this.application;

    coordinatorApp.status = 'rejected';

    this.coordinatorService
    .updateCoordinator(
      this.application._id,
      coordinatorApp
    )
    .subscribe(
      res => {
        this.dialogRef.close(res);
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }
  public accept(): void {
    const coordinatorApp = this.application;

    coordinatorApp.status = 'active';

    this.coordinatorService
    .updateCoordinator(
      this.application._id,
      coordinatorApp
    )
    .subscribe(
      res => {
        this.dialogRef.close(res);
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }
}
