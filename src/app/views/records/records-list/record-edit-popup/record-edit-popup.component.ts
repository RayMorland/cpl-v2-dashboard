import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecordsService } from 'app/shared/services/records/records.service';
import { Record } from 'app/shared/models/record.model';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, Router } from '@angular/router';
import { League } from 'app/shared/models/league.model';
import { MembersService } from 'app/shared/services/members/members.service';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { Member } from 'app/shared/models/member.model';
import { Meet } from 'app/shared/models/meet.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { Observable, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RecordGroupsService } from 'app/shared/services/record-groups/record-groups.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-record-edit-popup',
  templateUrl: './record-edit-popup.component.html',
  styleUrls: ['./record-edit-popup.component.scss'],
  animations: [egretAnimations],
})
export class RecordEditPopupComponent implements OnInit {
  public recordForm: FormGroup;
  public formReady = false;
  public editMode = false;
  public record: Record;
  public league: League;
  public members: Member[];
  public member: any;
  public meets: Meet[];
  public meet: Meet;
  public names = [];
  public divisions = [];
  public genders = [];
  public categories = [];
  public ageClasses = [];
  public weightClasses = [];
  public recordTypes = [];
  public tests = [];
  public lifts = [];

  public filteredMembers: Observable<Member[]>;
  filteredMeets: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RecordEditPopupComponent>,
    private fb: FormBuilder,
    private recordsService: RecordsService,
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private membersService: MembersService,
    private meetsService: MeetsService,
    private recordGroupsService: RecordGroupsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getData().subscribe((res) => {
      this.editMode = this.data.editMode;
      this.members = res[0];
      this.meets = res[1];
      this.league = res[2][0];
      console.log(this.league);
      this.initForm();
      if (this.editMode) {
        this.record = new Record(this.data.payload);
        console.log(this.record);
        this.setFormValues();
      } else {
        this.record = new Record();
      }
      this.formReady = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  private getData(): Observable<any> {
    const members = this.membersService.getMembers();
    const meets = this.meetsService.getMeets();
    const league = this.leagueService.getLeague();
    // const recordGroups = this.recordGroupsService.getRecordGroups();
    return forkJoin([members, meets, league]);
  }

  private onFormChanges(): void {
    this.recordForm.controls['member'].valueChanges.subscribe((val) => {
      this.member = this.members.filter((member) => member._id === val._id)[0];
      if (
        this.member !== undefined &&
        this.member.email !== this.recordForm.controls['email'].value
      ) {
        this.recordForm.patchValue(
          {
            email: this.member.email,
          },
          { emitEvent: false, onlySelf: true }
        );
      } else if (this.member === undefined) {
        this.recordForm.patchValue(
          {
            email: '',
          },
          { emitEvent: false, onlySelf: true }
        );
      }
    });

    this.recordForm.controls['meet'].valueChanges.subscribe((val) => {
      this.meet = this.meets.filter((meet) => meet._id === val)[0];
      if (
        this.meet !== undefined &&
        this.meet.hasOwnProperty('dates') &&
        this.meet.dates.length > 0 &&
        this.meet.dates[0].start !== undefined &&
        this.meet.dates[0].start !== this.recordForm.controls['date'].value
      ) {
        this.recordForm.patchValue(
          {
            date: new Date(this.meet.dates[0].start),
          },
          { emitEvent: false, onlySelf: true }
        );
      } else if (this.member === undefined) {
        this.recordForm.patchValue(
          {
            date: new Date(),
          },
          { emitEvent: false, onlySelf: true }
        );
      }
    });

    this.recordForm.controls['division'].valueChanges.subscribe((val) => {
      console.log(val);
      this.ageClasses = val.ageClasses;
    });

    this.recordForm.controls['gender'].valueChanges.subscribe((val) => {
      console.log(val);
      this.weightClasses = val.weightClasses;
    });

        this.recordForm.controls['event'].valueChanges.subscribe((val) => {
      console.log(val);
      this.lifts = val.movements;
    });
  }

  private _filter(value: string, control: string): any {
    const filterValue = value.toLowerCase();

    if (control === 'name') {
      return this.members.filter((member) =>
        member._id.toLowerCase().includes(filterValue)
      );
    } else if (control === 'meet') {
      return this.meets.filter((meet) =>
        meet._id.toLowerCase().includes(filterValue)
      );
    }
  }

  private initForm() {
    this.recordForm = this.fb.group({
      member: ['', Validators.required],
      date: [new Date(), Validators.required],
      meet: ['', Validators.required],
      email: [''],
      division: [null, Validators.required],
      gender: ['', Validators.required],
      category: ['', Validators.required],
      test: ['', Validators.required],
      weightClass: ['', Validators.required],
      ageClass: ['', Validators.required],
      event: ['', Validators.required],
      lift: ['', Validators.required],
    });
    this.onFormChanges();
    this.filteredMembers = this.memberControl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        typeof value === "string" ? value : value.personal.firstName
      ),
      map((name) => (name ? this.filterMembers(name) : this.members.slice()))
    );
    this.filteredMeets = this.recordForm.get('meet').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'meet'))
    );
  }

  private filterMembers(value: string): Member[] {
    const filterValue = value.toLowerCase();
    return this.members.filter((member) =>
      member.personal.firstName.toLowerCase().includes(filterValue)
    );
  }

  private get memberControl() {
    return this.recordForm.get('member');
  }

  private get dateControl() {
    return this.recordForm.get('date');
  }

  private get meetControl() {
    return this.recordForm.get('meet');
  }

  private get emailControl() {
    return this.recordForm.get('email');
  }

  private get divisionControl() {
    return this.recordForm.get('division');
  }

  private get genderControl() {
    return this.recordForm.get('gender');
  }

  private get categoryControl() {
    return this.recordForm.get('category');
  }

  private get testControl() {
    return this.recordForm.get('test');
  }

  private get weightClassControl() {
    return this.recordForm.get('weightClass');
  }

  private get ageClassControl() {
    return this.recordForm.get('ageClass');
  }

  private get eventControl() {
    return this.recordForm.get('event');
  }

  private get liftControl() {
    return this.recordForm.get('lift');
  }

  private setFormValues() {
    this.recordForm.patchValue({
      name: this.record.memberId,
      meet: this.record.meetId,
    });
  }

  public submitForm(): void {

    this.record.recordDate = this.dateControl.value;
    this.record.division = this.divisionControl.value;
    this.record.category = this.categoryControl.value;
    this.record.testing = this.testControl.value;
    this.record.gender = this.genderControl.value;
    this.record.ageClass = this.ageClassControl.value;
    this.record.weightClass = this.weightClassControl.value;
    if (this.members.includes(this.memberControl.value)) {
      this.record.memberId = this.memberControl.value._id;
    } else if (typeof this.memberControl.value === 'string') {
      this.record.memberName = this.memberControl.value;
    }
    if (this.meets.includes(this.meetControl.value)) {
      this.record.meetId = this.meetControl.value._id;
    } else if (typeof this.meetControl.value === 'string') {
      this.record.meetName = this.meetControl.value;
    }
    this.record.meetName = this.meetControl.value;

    console.log(this.record);
    if (this.editMode) {
      this.recordsService.updateRecord(this.record).subscribe((res) => {
        this.dialogRef.close(this.recordForm.value);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.recordsService.createRecord(this.record).subscribe((res) => {
        this.dialogRef.close(this.recordForm.value);
      }, (err) => {
        console.log(err);
      });
    }
  }

  displayFn(member: Member): string {
    // return member && member.personal.firstName ? member.personal.firstName : '';
    return member && member.personal.firstName
      ? member.personal.firstName + ' ' + member.personal.lastName
      : '';
  }
}
