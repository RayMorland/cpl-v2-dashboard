import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { Meet } from 'app/shared/models/meet.model';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, Router } from '@angular/router';
import { League } from 'app/shared/models/league.model';
import { MembersService } from 'app/shared/services/members/members.service';
import { Member } from 'app/shared/models/member.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { Observable, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-meet-requests-popup',
  templateUrl: './meet-requests-popup.component.html',
  styleUrls: ['./meet-requests-popup.component.scss'],
  animations: [egretAnimations]
})
export class MeetRequestsPopupComponent implements OnInit {
  public meetForm: FormGroup;
  public formReady = false;
  public editMode = false;
  public meet: Meet;
  public league: League;
  public members: Member[];
  public member: any;
  public meets: Meet[];

  filteredMembers: Observable<string[]>;
  filteredMeets: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetRequestsPopupComponent>,
    private fb: FormBuilder,
    private meetService: MeetsService,
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private membersService: MembersService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

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
        this.meet = this.data.payload;
        this.setFormValues();
      }
      this.formReady = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  private getData(): Observable<any> {
    const members = this.membersService.getMembers();
    const meets = this.meetService.getMeets();
    const league = this.leagueService.getLeague();
    // const meetGroups = this.meetGroupsService.getmeetGroups();
    return forkJoin([members, meets, league]);
  }

  // private getmeet(): Observable<any> {
  //  return this.meetService.findmeet(this.data.payload._id);
  // }

  private setValues() {}

  private onFormChanges(): void {
    // this.meetForm.controls['name'].valueChanges.subscribe(val => {
    //   this.member = this.members.filter(member => member._id === val)[0];
    //   if (this.member !== undefined && this.member.email !== this.meetForm.controls['email'].value) {
    //     this.meetForm.patchValue({
    //       email: this.member.email
    //     }, { emitEvent: false, onlySelf: true });
    //   } else if (this.member === undefined) {
    //     this.meetForm.patchValue({
    //       email: ''
    //     }, { emitEvent: false, onlySelf: true });
    //   }
    // });

    // this.meetForm.controls['meet'].valueChanges.subscribe(val => {
    //   this.meet = this.meets.filter(meet => meet._id === val)[0];
    //   if (
    //     this.meet !== undefined &&
    //     this.meet.hasOwnProperty('dates') &&
    //     this.meet.dates.length > 0 &&
    //     this.meet.dates[0].startTime !== undefined &&
    //     this.meet.dates[0].startTime !== this.meetForm.controls['date'].value
    //   ) {
    //     this.meetForm.patchValue({
    //       date: new Date(this.meet.dates[0].startTime)
    //     }, { emitEvent: false, onlySelf: true });
    //   } else if (this.member === undefined) {
    //     this.meetForm.patchValue({
    //       date: new Date()
    //     }, { emitEvent: false, onlySelf: true });
    //   }
    // });

    this.meetForm.valueChanges.subscribe(val => {
      // console.log(val);
    });
  }

  private _filter(value: string, control: string): any {
    const filterValue = value.toLowerCase();

    if (control === 'name') {
      return this.members.filter(member =>
        member._id.toLowerCase().includes(filterValue)
      );
    } else if (control === 'meet') {
      return this.meets.filter(meet =>
        meet._id.toLowerCase().includes(filterValue)
      );
    }
  }

  private initForm() {
    this.meetForm = this.fb.group({});
    this.onFormChanges();
    // this.filteredMembers = this.meetForm.get('name').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value, 'name'))
    //   );
    // this.filteredMeets = this.meetForm.get('meet').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value, 'meet'))
    //   );
  }

  private setFormValues() {
    this.meetForm.patchValue({});
  }

  public accept(): void {
    this.meetService
      .updateMeet(this.meet._id, { status: 'accepted' })
      .subscribe(
        res => {
          console.log(res);
          this.dialogRef.close();
        },
        err => {
          console.log(err);
        },
        () => {}
      );
  }
}
