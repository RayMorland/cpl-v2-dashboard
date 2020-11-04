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
import { Registration } from 'app/shared/models/registration.model';

@Component({
  selector: 'app-meet-registrants-popup',
  templateUrl: './meet-registrants-popup.component.html',
  styleUrls: ['./meet-registrants-popup.component.scss'],
  animations: [egretAnimations]
})
export class MeetRegistrantsPopupComponent implements OnInit {
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
  public registrant: Registration;

  filteredMembers: Observable<string[]>;
  filteredMeets: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetRegistrantsPopupComponent>,
    private fb: FormBuilder,
    private recordsService: RecordsService,
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private membersService: MembersService,
    private meetsService: MeetsService,
    private recordGroupsService: RecordGroupsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getData().subscribe(res => {
      this.editMode = this.data.editMode;
      this.members = res[0];
      this.meets = res[1];
      this.league = res[3];
      console.log(this.league);
      // this.setValues();
      this.initForm();
      if (this.editMode) {
        this.record = this.data.payload;
        this.setFormValues();
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

  // private getRecord(): Observable<any> {
  //  return this.recordsService.findRecord(this.data.payload._id);
  // }

  private setValues() {
    this.divisions = this.league.divisions;
    this.ageClasses = this.league.divisions[0].ageClasses;
    this.genders = this.league.genders;
    this.categories = this.league.categories;
    // this.weightClasses = this.league.weightClasses;
    this.recordTypes = this.league.events;
    this.tests = this.league.tests;
  }

  private onFormChanges(): void {
    this.recordForm.controls['name'].valueChanges.subscribe(val => {
      this.member = this.members.filter(member => member._id === val)[0];
      if (this.member !== undefined && this.member.email !== this.recordForm.controls['email'].value) {
        this.recordForm.patchValue({
          email: this.member.email
        }, { emitEvent: false, onlySelf: true });
      } else if (this.member === undefined) {
        this.recordForm.patchValue({
          email: ''
        }, { emitEvent: false, onlySelf: true });
      }
    });

    this.recordForm.controls['meet'].valueChanges.subscribe(val => {
      this.meet = this.meets.filter(meet => meet._id === val)[0];
      if (
        this.meet !== undefined &&
        this.meet.hasOwnProperty('dates') &&
        this.meet.dates.length > 0 &&
        this.meet.dates[0].start !== undefined &&
        this.meet.dates[0].start !== this.recordForm.controls['date'].value
      ) {
        this.recordForm.patchValue({
          date: new Date(this.meet.dates[0].start)
        }, { emitEvent: false, onlySelf: true });
      } else if (this.member === undefined) {
        this.recordForm.patchValue({
          date: new Date()
        }, { emitEvent: false, onlySelf: true });
      }
    });

    this.recordForm.valueChanges.subscribe(val => {
      // console.log(val);
    });
  }

  private _filter(value: string, control: string): any {
    const filterValue = value.toLowerCase();

    if (control === 'name') {
      return this.members.filter(member => member._id.toLowerCase().includes(filterValue));
    } else if (control === 'meet') {
      return this.meets.filter(meet => meet._id.toLowerCase().includes(filterValue));
    }
  }

  private initForm() {
    this.recordForm = this.fb.group({
      name: ['', Validators.required],
      date: [new Date(), Validators.required],
      meet: ['', Validators.required],
      email: [''],
      division: ['', Validators.required],
      gender: ['', Validators.required],
      category: ['', Validators.required],
      drugTest: ['', Validators.required],
      weightClass: ['', Validators.required],
      ageClass: ['', Validators.required],
      recordType: ['', Validators.required]
    });
    this.onFormChanges();
    this.filteredMembers = this.recordForm.get('name').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'name'))
      );
    this.filteredMeets = this.recordForm.get('meet').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'meet'))
      );
  }

  private setFormValues() {
    this.recordForm.patchValue({
      name: this.record.memberId,
      meet: this.record.meetId,

    });
  }

  public submitForm(): void {
    console.log(this.recordForm.value);
    if (this.editMode) {
      this.recordsService.updateRecord(this.recordForm.value).subscribe((res) => {
        this.dialogRef.close(this.recordForm.value);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.recordsService.createRecord(this.recordForm.value).subscribe((res) => {
        this.dialogRef.close(this.recordForm.value);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
