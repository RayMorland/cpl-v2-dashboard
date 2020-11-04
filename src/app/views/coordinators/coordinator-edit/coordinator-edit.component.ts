import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, forkJoin } from 'rxjs';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { PlatformService } from 'app/shared/services/platform/platform.service';
import { LeagueService } from 'app/shared/services/league/league.service';
import { League } from 'app/shared/models/league.model';
import { Coordinator } from 'app/shared/models/coordinator.model';

@Component({
  selector: 'app-coordinator-edit',
  templateUrl: './coordinator-edit.component.html',
  styleUrls: ['./coordinator-edit.component.scss'],
  animations: [egretAnimations]
})
export class CoordinatorEditComponent implements OnInit {
  formData = {};
  formReady = false;
  editMode = false;
  console = console;
  coordinator: Coordinator;
  coordinatorId: string;
  coordinatorReady = false;

  league: League;

  coordinatorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coordinatorService: CoordinatorsService,
    private platformService: PlatformService,
    private leagueService: LeagueService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader.open();
    this.initForm();

    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.coordinatorId = params.id;
          this.editMode = true;
          console.log(this.coordinatorId);
          this.getData().subscribe(res => {
            this.coordinator = new Coordinator(res[0]);
            // this.league = new League(res[1]);
            this.setFormValues();
            this.loader.close();
            this.coordinatorReady = true;
            this.changeDetectorRef.detectChanges();
          });
        } else {
          this.editMode = false;
          this.loader.close();
          this.coordinator = new Coordinator();
          this.coordinatorReady = true;
          this.changeDetectorRef.detectChanges();
          // this.getData().subscribe(res => {

          // });
        }
      }
    );
  }

  private getData(): Observable<any> {
    // if (this.editMode) {
      const coordinator = this.coordinatorService.findCoordinator(this.coordinatorId);
      return forkJoin([coordinator]);
    // }
  }

  private initForm() {
    // this.formReady = true;

    this.coordinatorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      hq: this.fb.group({
        province: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        postal: ['', Validators.required],
        country: ['', Validators.required]
      }),
      phone: ['']
    });

    this.onFormChanges();
  }

  private onFormChanges(): void {
    this.coordinatorForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  private setFormValues() {
    this.nameControl.setValue(this.coordinator.name);
    this.emailControl.setValue(this.coordinator.email);
    this.phoneControl.setValue(this.coordinator.phone);
    this.streetControl.setValue(this.coordinator.hq.street);
    this.cityControl.setValue(this.coordinator.hq.city);
    this.provinceControl.setValue(this.coordinator.hq.province);
    this.postalControl.setValue(this.coordinator.hq.postal);
    this.countryControl.setValue(this.coordinator.hq.country);
  }

  public submitForm(): void {
    this.coordinator.name = this.nameControl.value;
    this.coordinator.email = this.emailControl.value;
    this.coordinator.phone = this.phoneControl.value;
    this.coordinator.hq = this.hqControl.value;
    console.log(this.coordinator);
    if (this.editMode) {
      this.coordinatorService.updateCoordinator(this.coordinatorId, this.coordinator).subscribe((res) => {
        this.router.navigate(['/coordinators/' + res._id]);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.coordinatorService.adminCreateCoordinator(this.coordinator).subscribe((res) => {
        console.log(res);
        this.router.navigate(['/coordinators/' + res[0]._id]);
      }, (err) => {
        console.log(err);
      });
    }
  }

  private get nameControl() {
    return this.coordinatorForm.get('name');
  }
  private get emailControl() {
    return this.coordinatorForm.get('email');
  }
  private get phoneControl() {
    return this.coordinatorForm.get('phone');
  }
  private get hqControl() {
    return this.coordinatorForm.get('hq') as FormGroup;
  }
  private get cityControl() {
    return this.coordinatorForm.get('hq.city');
  }
  private get provinceControl() {
    return this.coordinatorForm.get('hq.province');
  }
    private get streetControl() {
    return this.coordinatorForm.get('hq.street');
  }
  private get countryControl() {
    return this.coordinatorForm.get('hq.country');
  }
  private get postalControl() {
    return this.coordinatorForm.get('hq.postal');
  }
}