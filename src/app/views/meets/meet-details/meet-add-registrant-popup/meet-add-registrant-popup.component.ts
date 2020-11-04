import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MembersService } from "app/shared/services/members/members.service";
import { Observable, forkJoin } from "rxjs";
import { Member } from "app/shared/models/member.model";
import { RegistrationService } from "app/shared/services/registrations/registration.service";
import { Registration } from "app/shared/models/registration.model";
import { League } from "app/shared/models/league.model";
import { Params } from "@angular/router";
import { Meet } from "app/shared/models/meet.model";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { LeagueService } from "app/shared/services/league/league.service";
import {
  postalCodeValidator,
  dateValidator,
  dateOfBirthValidator,
  atLeastOneSelected,
} from "app/shared/helpers/validators";
import { startWith, map } from "rxjs/operators";
import { PlatformService } from "app/shared/services/platform/platform.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-meet-add-registrant-popup",
  templateUrl: "./meet-add-registrant-popup.component.html",
  styleUrls: ["./meet-add-registrant-popup.component.scss"],
})
export class MeetAddRegistrantPopupComponent implements OnInit {
  public registrationForm: FormGroup;
  public registration: Registration;
  public members: Member[] = [];
  public editMode = false;
  public formReady = false;
  private meet: Meet;
  public meetReady = false;
  private league = new League();
  public filteredMembers: Observable<Member[]>;
  public weightClassOptions: Observable<{ name: string; weight: string }>;

  private dp = new DatePipe(navigator.language);
  private p = "yyyy-MM-dd";
  private memberAge: any;
  private today: any;
  private birthDate: any;

  private registrationTotal = 0;
  public submitPressed = false;
  private registrantMovements = [];
  private currentMovements = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetAddRegistrantPopupComponent>,
    private fb: FormBuilder,
    private membersService: MembersService,
    private registrationService: RegistrationService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    // this.loader.open();
    this.league = new League();
    if (this.data.title === "new") {
      this.editMode = false;
      this.getData().subscribe((res) => {
        this.members = res[0];
        console.log(this.data);
        this.registration = new Registration();
        this.meet = this.data.meet;
        this.initForm();
        this.meetReady = true;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    } else {
      this.editMode = true;
      this.getData().subscribe((res) => {
        this.members = res[0];
        this.registration = new Registration(this.data.payload);
        this.meet = this.data.meet;
        this.initForm();
        this.setFormValues();
        this.meetReady = true;
        this.changeDetectorRef.detectChanges();
        // this.loader.close();
      });
    }
  }

  private getData(): Observable<any> {
    if (this.editMode) {
    }
    const members = this.membersService.getMembers();
    return forkJoin([members]);
  }

  private initForm() {
    const meetEvents = this.meet.eventInfo.events.map(
      (control) => new FormControl(false)
    );
    const meetDivisions = this.league.divisions.map(
      (control) => new FormControl(false)
    );
    const meetMerchandise = this.meet.merchandise.map(
      (control) => new FormControl(false)
    );

    this.registrationForm = this.fb.group({
      member: [null, [Validators.required, this.isMember.bind(this)]],
      dateOfBirth: [null, [Validators.required, dateOfBirthValidator]],
      email: [null, Validators.required],
      address: this.fb.group({
        street: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        city: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        province: [null, [Validators.required]],
        country: [null, [Validators.required]],
        postal: [null, [Validators.required, postalCodeValidator]],
      }),
      gender: [null, [Validators.required]],
      competitionInfo: this.fb.group({
        weightClass: [null, [Validators.required]],
        divisions: this.fb.array(meetDivisions, atLeastOneSelected),
        category: [null, [Validators.required]],
        test: [null, [Validators.required]],
        events: this.fb.array(meetEvents, atLeastOneSelected),
        lifts: this.fb.array([]),
      }),
      fees: this.fb.group({
        recordCertificate: [null],
        merchandise: this.fb.array(meetMerchandise),
        feesPaid: [false],
      }),
    });

    this.filteredMembers = this.memberControl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        typeof value === "string" ? value : value.personal.firstName
      ),
      map((name) => (name ? this.filterMembers(name) : this.members.slice()))
    );

    this.weightClassOptions = this.genderControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.selectWeightClassOptions(value))
    );

    this.memberControl.valueChanges.subscribe((res) => {
      if (this.members.includes(this.memberControl.value)) {
        this.emailControl.setValue(this.memberControl.value.email);
        this.emailControl.disable();
        this.genderControl.setValue(this.memberControl.value.personal.gender);
        this.genderControl.disable();
        this.dateOfBirthControl.setValue(
          this.dp.transform(this.memberControl.value.personal.dob, this.p)
        );
        this.dateOfBirthControl.disable();
        this.streetControl.setValue(
          this.memberControl.value.personal.address.street
        );
        this.streetControl.disable();
        this.cityControl.setValue(
          this.memberControl.value.personal.address.city
        );
        this.cityControl.disable();
        this.provinceControl.setValue(
          this.memberControl.value.personal.address.province
        );
        this.provinceControl.disable();
        this.countryControl.setValue(
          this.memberControl.value.personal.address.country
        );
        this.countryControl.disable();
        this.postalControl.setValue(
          this.memberControl.value.personal.address.postal
        );
        this.postalControl.disable();
      } else {
        this.emailControl.enable();
        this.genderControl.enable();
        this.dateOfBirthControl.enable();
        this.streetControl.enable();
        this.cityControl.enable();
        this.provinceControl.enable();
        this.countryControl.enable();
        this.postalControl.enable();
      }
    });

    this.dateOfBirthControl.valueChanges.subscribe((res) => {
      this.divisionsControl.controls.forEach((divisionSelected, index) => {
        const division = this.league.divisions[index];
        const minAge = division.ageClasses[0].min;
        const maxAge = division.ageClasses[division.ageClasses.length - 1].max;
        this.today = new Date();
        this.birthDate = new Date(this.dateOfBirthControl.value);
        this.memberAge =
          this.today.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = this.today.getMonth() - this.birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && this.today.getDate() < this.birthDate.getDate())
        ) {
          this.memberAge--;
        }
        if (this.memberAge < minAge || this.memberAge > maxAge) {
          this.divisionsControl.controls[index].disable();
        } else {
          this.divisionsControl.controls[index].enable();
        }
      });
    });

    this.eventsControl.valueChanges.subscribe((res) => {
      console.log(this.eventsControl.value);
      this.addLiftControls(res);
    });

    this.onFormChanges();
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
        this.liftsControl.push(
          this.fb.group({
            liftType: [lift, []],
            rackPosition: [null, []],
            rackHeight: [null, []],
            openingWeight: [null, []],
            safetyHeight: [null, []],
          })
        );
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

  private onFormChanges(): void {
    this.registrationForm.valueChanges.subscribe((res) => {
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    let divisionsTotal = 0;
    const numberOfDivisions = this.divisionsControl.controls.filter(
      (control) => control.value
    ).length;
    if (numberOfDivisions > 1) {
      divisionsTotal = 50 * numberOfDivisions;
    }

    let eventsTotal = 0;
    this.eventsControl.controls.forEach((lift, index) => {
      if (lift.value) {
        eventsTotal += this.meet.eventInfo.events[index].price;
      }
    });

    let testTotal = 0;
    this.league.tests.forEach((test) => {
      if (test.type === this.testControl.value) {
        testTotal += test.price;
      }
    });

    let extraFeesTotal = 0;
    if (this.recordCertificateControl.value) {
      extraFeesTotal += 50;
    }

    let merchandiseTotal = 0;
    this.merchandiseControl.controls.forEach((control, index) => {
      if (control.value) {
        merchandiseTotal += this.meet.merchandise[index].price;
      }
    });

    this.registrationTotal =
      divisionsTotal +
      eventsTotal +
      testTotal +
      extraFeesTotal +
      merchandiseTotal;
  }

  private setFormValues() {
    // Personal
    this.memberControl.setValue(
      this.members.find((member) => member._id === this.registration.memberId)
    );
    this.memberControl.disable();
    this.dateOfBirthControl.setValue(
      this.dp.transform(this.registration.dateOfBirth, this.p)
    );

    // Competition Info
    this.weightClassControl.setValue(
      this.registration.competitionInfo.weightClass
    );
    this.testControl.setValue(this.registration.competitionInfo.test);
    this.categoryControl.setValue(this.registration.competitionInfo.category);

    this.league.divisions.forEach((division, index) => {
      this.registration.competitionInfo.divisions.forEach((divName, index2) => {
        if (division.name === divName.name) {
          this.divisionsControl.controls[index].setValue(true);
        }
      });
    });

    this.meet.eventInfo.events.forEach((event, index) => {
      this.registration.competitionInfo.events.forEach((eventType, index2) => {
        if (event.type === eventType.type) {
          this.eventsControl.controls[index].setValue(true);
        }
      });
    });

    this.addLiftControls(this.eventsControl.value);
    console.log(this.registration);
    this.registration.competitionInfo.movements.forEach((movement, index) => {
      const control = this.liftsControl.controls.findIndex(
        (controlGroup: FormGroup) => {
          console.log(controlGroup.controls.liftType.value, movement);
          return controlGroup.controls.liftType.value === movement.type;
        }
      );
      this.liftsControl.controls[control].setValue({
        liftType: movement.type,
        openingWeight: movement.openingWeight,
        rackHeight: movement.rackHeight,
        rackPosition: movement.rackPosition,
        safetyHeight: movement.safetyHeight
      });
    });

    // Fees Info
    this.meet.merchandise.forEach((merch, index) => {
      this.registration.fees.merchandise.forEach((merchItem, index2) => {
        if (merch.item === merchItem.item) {
          this.merchandiseControl.controls[index].setValue(true);
        }
      });
    });
    this.recordCertificateControl.setValue(
      this.registration.fees.recordCertificate.purchased
    );
    this.feesPaidControl.setValue(this.registration.fees.feesPaid);

    this.registrationTotal = this.registration.fees.total;
  }

  public submitForm(): void {
    // Personal Info
    this.registration.memberId = this.memberControl.value._id;
    this.registration.meetId = this.meet._id;
    this.registration.name =
      this.memberControl.value.personal.firstName +
      " " +
      this.memberControl.value.personal.lastName;
    this.registration.email = this.emailControl.value;
    this.registration.address = this.addressGroup.value;
    this.registration.dateOfBirth = this.dateOfBirthControl.value;
    this.registration.gender = this.genderControl.value;

    // Competition Info
    this.registration.competitionInfo.weightClass = this.weightClassControl.value;
    this.registration.competitionInfo.test = this.testControl.value;
    this.registration.competitionInfo.category = this.categoryControl.value;
    this.registration.competitionInfo.divisions = [];
    this.divisionsControl.controls.forEach((control, index) => {
      if (control.value) {
        const division = this.league.divisions[index];
        let selectedAgeClass: { min: any; max: any };
        division.ageClasses.forEach((ages) => {
          if (ages.min <= this.memberAge && this.memberAge <= ages.max) {
            selectedAgeClass = {
              min: ages.min,
              max: ages.max,
            };
          }
        });
        this.registration.competitionInfo.divisions.push({
          name: division.name,
          ageClass: selectedAgeClass,
        });
      }
    });
    this.registration.competitionInfo.events = [];
    this.eventsControl.controls.forEach((control, index) => {
      if (control.value) {
        const event = this.league.events[index];
        this.registration.competitionInfo.events.push({
          type: event.type,
        });
      }
    });
    this.liftsControl.controls.forEach((control, index) => {
      this.registration.competitionInfo.movements.push({
        type: control.value.liftType,
        openingWeight: control.value.openingWeight,
        rackHeight: control.value.rackHeight,
        safetyHeight: control.value.safetyHeight,
        rackPosition: control.value.rackPosition,
      });
    });
    this.registration.fees.merchandise = [];
    this.merchandiseControl.controls.forEach((control, index) => {
      if (control.value) {
        const merchItem = this.meet.merchandise[index];
        this.registration.fees.merchandise.push(merchItem);
      }
    });

    // Fees Info
    this.registration.fees.total = this.registrationTotal;
    this.registration.fees.recordCertificate.purchased = this.recordCertificateControl.value;
    this.registration.fees.recordCertificate.price = this.league.recordCertificate.price;
    this.registration.fees.feesPaid = this.feesPaidControl.value;

    console.log(this.registration);

    if (this.editMode) {
      this.registrationService
        .updateRegistration(this.registration._id, this.registration)
        .subscribe(
          (res) => {
            this.dialogRef.close(res);
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
    } else {
      this.registrationService
        .adminCreateRegistration(this.registration)
        .subscribe(
          (res) => {
            console.log(res);
            this.dialogRef.close(res);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  private selectWeightClassOptions(value: string): any {
    let selectedGender = 0;
    this.league.genders.forEach((gender, index) => {
      if (gender.name === value) {
        selectedGender = index;
      }
    });
    return this.league.genders[selectedGender].weightClasses;
  }

  private filterMembers(value: string): Member[] {
    const filterValue = value.toLowerCase();
    return this.members.filter((member) =>
      member.personal.firstName.toLowerCase().includes(filterValue)
    );
  }

  get memberControl() {
    return this.registrationForm.get("member");
  }

  get genderControl() {
    return this.registrationForm.get("gender");
  }

  get emailControl() {
    return this.registrationForm.get("email");
  }

  get dateOfBirthControl() {
    return this.registrationForm.get("dateOfBirth");
  }

  get addressGroup() {
    return this.registrationForm.get("address");
  }

  get streetControl() {
    return this.registrationForm.get("address.street");
  }

  get postalControl() {
    return this.registrationForm.get("address.postal");
  }

  get cityControl() {
    return this.registrationForm.get("address.city");
  }

  get provinceControl() {
    return this.registrationForm.get("address.province");
  }

  get countryControl() {
    return this.registrationForm.get("address.country");
  }

  get weightClassControl() {
    return this.registrationForm.get("competitionInfo.weightClass");
  }

  get categoryControl() {
    return this.registrationForm.get("competitionInfo.category");
  }

  get testControl() {
    return this.registrationForm.get("competitionInfo.test");
  }

  get divisionsControl() {
    return this.registrationForm.get("competitionInfo.divisions") as FormArray;
  }

  get eventsControl() {
    return this.registrationForm.get("competitionInfo.events") as FormArray;
  }

  get liftsControl() {
    return this.registrationForm.get("competitionInfo.lifts") as FormArray;
  }

  get recordCertificateControl() {
    return this.registrationForm.get("fees.recordCertificate");
  }

  get merchandiseControl() {
    return this.registrationForm.get("fees.merchandise") as FormArray;
  }

  get feesPaidControl() {
    return this.registrationForm.get("fees.feesPaid");
  }

  displayFn(member: Member): string {
    // return member && member.personal.firstName ? member.personal.firstName : '';
    return member && member.personal.firstName
      ? member.personal.firstName + " " + member.personal.lastName
      : "";
  }

  isMember(c: FormGroup): { [key: string]: boolean } | null {
    if (this.members.includes(c.value)) {
      return null;
    }
    return { notMember: true };
  }
}
