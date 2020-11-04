import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { MembersService } from 'app/shared/services/members/members.service';
import { RegistrationService } from 'app/shared/services/registrations/registration.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { LeagueService } from 'app/shared/services/league/league.service';
import { PlatformService } from 'app/shared/services/platform/platform.service';
import { forkJoin, Observable } from 'rxjs';
import { League } from 'app/shared/models/league.model';
import { Member } from 'app/shared/models/member.model';
import { Meet } from 'app/shared/models/meet.model';
import { startWith, map, tap } from 'rxjs/operators';
import { atLeastOneSelected } from 'app/shared/helpers/validators';
import { Result } from 'app/shared/models/result.model';
import { ResultsService } from 'app/shared/services/results/results.service';
import { Lift } from 'app/shared/models/lift.model';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { Registration } from 'app/shared/models/registration.model';

@Component({
  selector: 'app-meet-result-edit-popup',
  templateUrl: './meet-result-edit-popup.component.html',
  styleUrls: ['./meet-result-edit-popup.component.scss'],
})
export class MeetResultEditPopupComponent implements OnInit {
  private editMode = false;
  private members: Member[];
  private member: Member;
  private meet: Meet;
  public loaderOpen = true;
  private resultForm: FormGroup;
  public filteredRegistrations: Observable<Registration[]>;
  private league = new League();
  public submitPressed = false;
  public lifts: FormArray;
  public resultLifts = ['bench', 'squat', 'deadlift'];
  public currentResultLifts = ['bench', 'squat', 'deadlift'];
  private result: Result;
  public resultsReady = false;
  private meetRegistrations: Registration[];
  private registrantMovements: any = [];
  private currentMovements: any = [];
  public error = false;
  public errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetResultEditPopupComponent>,
    private fb: FormBuilder,
    private membersService: MembersService,
    private registrationService: RegistrationService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService,
    private resultsService: ResultsService,
    private meetSerivce: MeetsService
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.meet = this.data.meet;
    this.meetRegistrations = this.data.registrants;
    if (this.data.isNew) {
      this.editMode = false;
      this.getData().subscribe((res) => {
        this.members = res[0];
        this.result = new Result();
        this.loaderOpen = false;
        this.initForm();
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    } else {
      this.editMode = true;
      this.getData().subscribe((res) => {
        this.members = res[0];
        this.result = new Result(this.data.result);
        console.log(this.meetRegistrations);
        this.resultsReady = true;
        this.loaderOpen = false;
        this.initForm();
        this.setFormValues();
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    }
  }

  private getData(): Observable<any> {
    if (this.editMode) {
      const members = this.membersService.getMembers();
      const registrations = this.meetSerivce.getMeetRegistrants(this.meet._id);
      const result = this.resultsService.findResult(this.data.result._id);
      return forkJoin([members, result, registrations]);
    } else {
      const members = this.membersService.getMembers();
      const registrations = this.meetSerivce.getMeetRegistrants(this.meet._id);
      return forkJoin([members, registrations]);
    }
  }

  private initForm() {
    const meetDivisions = this.league.divisions.map(
      (control) => new FormControl(false)
    );

    const meetEvents = this.meet.eventInfo.events.map(
      (control) => new FormControl(false)
    );

    this.resultForm = this.fb.group({
      registration: [
        null,
        [Validators.required, this.isRegistration.bind(this)],
      ],
      testing: [null, [Validators.required]],
      divisions: this.fb.array(meetDivisions, atLeastOneSelected),
      category: [null, [Validators.required]],
      weightAtWeighIn: [null, [Validators.required]],
      events: this.fb.array(meetEvents, atLeastOneSelected),
      lifts: this.fb.array([], [Validators.max(3)]),
    });

    this.filteredRegistrations = this.registrationControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) =>
        name ? this.filterRegistrations(name) : this.meetRegistrations.slice()
      ),
      tap(() => {
        console.log(this.registrationControl.value);
        if (this.registrationControl.value != null) {
          this.categoryControl.setValue(
            this.registrationControl.value.competitionInfo.category
          );
          this.categoryControl.disable();
          this.testingControl.setValue(
            this.registrationControl.value.competitionInfo.test
          );
          this.testingControl.disable();
          this.divisionsControl.controls.forEach((control, index) => {
            this.registrationControl.value.competitionInfo.divisions.forEach(
              (div) => {
                if (div.name === this.league.divisions[index].name) {
                  control.setValue(true);
                } else {
                  control.disable();
                }
              }
            );
          });
          this.eventsControl.controls.forEach((control, index) => {
            this.registrationControl.value.competitionInfo.events.forEach(
              (event) => {
                console.log(event);
                if (event.type === this.meet.eventInfo.events[index].type) {
                  control.setValue(true);
                } 
                // else {
                //   control.disable();
                // }
              }
            );
          });
        }
      })
    );

    this.resultForm.valueChanges.subscribe((res) => {
      console.log(this.resultForm);
      // this.onFormChanges();
    });
    this.eventsControl.valueChanges.subscribe((res) => {
      console.log(res);
      this.addLiftControls(res);
    });
  }


  private submitForm() {
    this.member = this.members[
      this.members.findIndex(
        (member) => member._id === this.registrationControl.value.memberId
      )
    ];
    console.log(this.member);
    this.result.registrationId = this.registrationControl.value._id;
    this.result.status = 'active';
    this.result.memberId = this.registrationControl.value.memberId;
    this.result.memberName = this.registrationControl.value.name;
    this.result.meetId = this.meet._id;
    this.result.meetTitle = this.meet.title;
    this.result.gender = this.member.personal.gender;
    this.result.testing = this.testingControl.value;
    this.result.divisions = [];
    this.divisionsControl.value.forEach((res, index) => {
      let ageClass;
      // find ageClasss based on member name
      // this.league.divisions[index].ageClasses.findIndex(ageC => {
      // if (ageC)
      // });
      if (res) {
        this.result.divisions.push({
          name: this.league.divisions[index].name,
          ageClass: { min: 16, max: 19 },
        });
      }
    });
    this.result.category = this.categoryControl.value;
    this.result.events = [];
    this.eventsControl.value.forEach((res, index) => {
      if (res) {
        this.result.events.push(this.meet.eventInfo.events[index].type);
      }
    });
    this.result.weightAtWeighIn = this.weightAtWeighInControl.value;
    this.league.genders.forEach((gender) => {
      if (gender.name === this.result.gender) {
        let wClass = gender.weightClasses.findIndex((weightClass) => {
          if (
            this.result.weightAtWeighIn >= weightClass.weightRange.min &&
            this.result.weightAtWeighIn < weightClass.weightRange.max
          ) {
            return true;
          }
        });
        console.log(gender);
        this.result.weightClass = gender.weightClasses[wClass].name;
      }
    });

    // Lifts
    if (this.editMode) {
      this.liftsControl.controls.forEach((lift, index) => {
        let highestWeight;

        if (
          lift.value.attempt3.success &&
          lift.value.attempt3.weight > lift.value.attempt2.weight &&
          lift.value.attempt3.weight > lift.value.attempt1.weight
        ) {
          highestWeight = lift.value.attempt3.weight;
        } else if (
          lift.value.attempt2.success &&
          lift.value.attempt2.weight > lift.value.attempt1.weight
        ) {
          highestWeight = lift.value.attempt2.weight;
        } else if (lift.value.attempt1.success) {
          highestWeight = lift.value.attempt1.weight;
        }

        this.result.lifts[index].status = 'active';
        this.result.lifts[index].gender = this.result.gender;
        this.result.lifts[index].memberId = this.result.memberId;
        this.result.lifts[index].meetId = this.result.meetId;
        this.result.lifts[index].testing = this.testingControl.value;
        this.result.lifts[index].category = this.categoryControl.value;
        this.result.lifts[index].events = this.result.events;
        this.result.lifts[index].divisions = this.result.divisions;
        this.result.lifts[index].weightClass = this.result.weightClass;
        this.result.lifts[index].liftType = lift.value.liftType;
        this.result.lifts[index].rackPosition = lift.value.rackPosition;
        this.result.lifts[index].rackHeight = lift.value.rackHeight;
        this.result.lifts[index].startingWeight = lift.value.startingWeight;
        this.result.lifts[index].attempt1.weight = lift.value.attempt1.weight;
        this.result.lifts[index].attempt1.success = lift.value.attempt1.success;
        this.result.lifts[index].attempt2.weight = lift.value.attempt2.weight;
        this.result.lifts[index].attempt2.success = lift.value.attempt2.success;
        this.result.lifts[index].attempt3.weight = lift.value.attempt3.weight;
        this.result.lifts[index].attempt3.success = lift.value.attempt3.success;
        this.result.lifts[index].highestWeight = highestWeight;
        this.result.lifts[index].isRecord = false;
        this.result.lifts[index].records = [];
      });
    } else {
      this.liftsControl.controls.forEach((lift) => {
        let highestWeight;

        if (
          lift.value.attempt3.success &&
          lift.value.attempt3.weight > lift.value.attempt2.weight &&
          lift.value.attempt3.weight > lift.value.attempt1.weight
        ) {
          highestWeight = lift.value.attempt3.weight;
        } else if (
          lift.value.attempt2.success &&
          lift.value.attempt2.weight > lift.value.attempt1.weight
        ) {
          highestWeight = lift.value.attempt2.weight;
        } else if (lift.value.attempt1.success) {
          highestWeight = lift.value.attempt1.weight;
        }

        this.result.lifts.push(
          new Lift({
            status: 'active',
            gender: this.result.gender,
            memberId: this.result.memberId,
            meetId: this.result.meetId,
            testing: this.testingControl.value,
            category: this.categoryControl.value,
            events: this.result.events,
            divisions: this.result.divisions,
            weightClass: this.result.weightClass,
            liftType: lift.value.liftType,
            rackPosition: lift.value.rackPosition,
            rackHeight: lift.value.rackHeight,
            startingWeight: lift.value.startingWeight,
            attempt1: lift.value.attempt1,
            attempt2: lift.value.attempt2,
            attempt3: lift.value.attempt3,
            highestWeight: highestWeight,
            singleLiftRecord: false,
            singleLiftRecordId: null,
          })
        );
      });
    }
    this.result.resultDate = this.meet.dates[0].start;

    // Calculate Total
    this.result.total = 0;
    this.liftsControl.controls.forEach((lift) => {
      if (lift.value.attempt3.success) {
        this.result.total += lift.value.attempt3.weight;
      } else if (lift.value.attempt2.success) {
        this.result.total += lift.value.attempt2.weight;
      } else if (lift.value.attempt1.success) {
        this.result.total += lift.value.attempt1.weight;
      }
    });
    this.result.wilksScore = 0;

    this.loaderOpen = true;

    if (this.editMode) {
      this.resultsService.updateResult(this.result._id, this.result).subscribe(
        (res) => {
          this.dialogRef.close(res);
        },
        (err) => {
          this.loaderOpen = false;
          this.errorMessage = err.error.message;
          this.error = true;
          console.log(err);
        },
        () => {}
      );
    } else {
      this.resultsService.createResult(this.result).subscribe(
        (res) => {
          this.dialogRef.close(res);
        },
        (err) => {
          this.loaderOpen = false;
          this.errorMessage = err.error.message;
          this.error = true;
          console.log(err);
        },
        () => {}
      );
    }
  }

  get registrationControl() {
    return this.resultForm.get('registration');
  }

  get testingControl() {
    return this.resultForm.get('testing');
  }

  get divisionsControl() {
    return this.resultForm.get('divisions') as FormArray;
  }

  get categoryControl() {
    return this.resultForm.get('category');
  }

  get weightAtWeighInControl() {
    return this.resultForm.get('weightAtWeighIn');
  }

  get liftsControl() {
    return this.resultForm.get('lifts') as FormArray;
  }

  get eventsControl() {
    return this.resultForm.get('events') as FormArray;
  }

  private setFormValues() {
    this.registrationControl.setValue(
      this.meetRegistrations[
        this.meetRegistrations.findIndex(
          (registration) => registration._id === this.result.registrationId
        )
      ]
    );
    this.registrationControl.disable();
    this.categoryControl.setValue(this.result.category);
    this.categoryControl.disable();
    this.testingControl.setValue(this.result.testing);
    this.testingControl.disable();
    this.result.divisions.forEach((div) => {
      this.divisionsControl.controls.forEach((divControl, index) => {
        if (this.league.divisions[index].name === div.name) {
          divControl.setValue(true);
        }
      });
    });
    this.divisionsControl.disable();
    this.weightAtWeighInControl.setValue(this.result.weightAtWeighIn);
    this.weightAtWeighInControl.disable();
    this.result.events.forEach((event) => {
      this.eventsControl.controls.forEach((eventControl, index) => {
        if (this.meet.eventInfo.events[index].type === event) {
          eventControl.setValue(true);
        }
      });
    });
    this.eventsControl.disable();
    this.addLiftControls(this.eventsControl.value);
    this.result.lifts.forEach((movement, index) => {
      const control = this.liftsControl.controls.findIndex(
        (controlGroup: FormGroup) => {
          console.log(controlGroup.controls.liftType.value, movement);
          return controlGroup.controls.liftType.value === movement.liftType;
        }
      );
      this.liftsControl.controls[control].setValue({
        liftType: movement.liftType,
        rackPosition: movement.rackPosition,
        rackHeight: movement.rackHeight,
        startingWeight: movement.startingWeight,
        attempt1: {
          weight: movement.attempt1.weight,
          success: movement.attempt1.success
        },
        attempt2: {
          weight: movement.attempt2.weight,
          success: movement.attempt2.success
        },
        attempt3: {
          weight: movement.attempt3.weight,
          success: movement.attempt3.success
        },
      });
    });
  }

  private addLift(lift: string) {
    this.liftsControl.push(
      this.fb.group({
        liftType: [lift, []],
        rackPosition: [null, []],
        rackHeight: [null, []],
        startingWeight: [null, []],
        attempt1: this.fb.group({
          weight: [null, [Validators.required]],
          success: [false, [Validators.required]],
        }),
        attempt2: this.fb.group({
          weight: [null, []],
          success: [false, []]
        }),
        attempt3: this.fb.group({
          weight: [null, []],
          success: [false, []],
        }),
      })
    );
  }

  private addLiftControls(events) {
    this.registrantMovements = [];

    this.meet.eventInfo.events.forEach((event, index) => {
      console.log(event);
      if (events[index]) {
        this.registrantMovements.push(event.movements);
      }
    });

    let a = [];

    this.registrantMovements.forEach((movement) => {
      a = a.concat(movement.filter((b) => a.indexOf(b) < 0));
    });

    a.forEach((lift) => {
      if (!this.currentMovements.includes(lift)) {
        this.addLift(lift);
      }
    });

    this.currentMovements.forEach((movement) => {
      let i = this.liftsControl.controls.findIndex(
        (liftGroup: FormGroup) => liftGroup.controls.liftType.value === movement
      );
      if (!a.includes(movement)) {
        this.liftsControl.removeAt(i);
      }
    });
    this.currentMovements = a;
  }

  private removeLift(index): void {
    this.liftsControl.removeAt(index);
  }

  private filterRegistrations(value: string): Registration[] {
    const filterValue = value.toLowerCase();
    return this.meetRegistrations.filter((reg) =>
      reg.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(registration: Registration): string {
    // return member && member.personal.firstName ? member.personal.firstName : '';
    return registration && registration.name ? registration.name : '';
  }

  isRegistration(c: FormGroup): { [key: string]: boolean } | null {
    if (this.meetRegistrations.includes(c.value)) {
      return null;
    }
    return { notRegistration: true };
  }

  private atLeastOneSelectedByType(
    c: FormArray
  ): { [key: string]: boolean } | null {
    if (c.controls.filter((control) => control.value.type).length > 0) {
      return null;
    }
    return { atLeastOneSelected: true };
  }

  private attemptsValidator(c: FormGroup): { [key: string]: boolean } | null {
    console.log(c);
    return { attemptValid: true };
  }
}
