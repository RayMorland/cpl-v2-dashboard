import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  FormGroupDirective
} from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { League } from 'app/shared/models/league.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { forkJoin, Observable } from 'rxjs';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Meet } from 'app/shared/models/meet.model';
import { Registration } from 'app/shared/models/registration.model';
import { Member } from 'app/shared/models/member.model';
import { MeetRequestsPopupComponent } from './meet-requests-popup/meet-requests-popup.component';

@Component({
  selector: 'app-meet-requests',
  templateUrl: './meet-requests.component.html',
  styleUrls: ['./meet-requests.component.scss'],
  animations: [egretAnimations]
})
export class MeetRequestsComponent implements OnInit {
  meetId: string;
  meet: Meet;
  meets: Meet[];
  meetReady = false;
  meetsReady = false;
  registrations: Registration[];
  members: Member[];
  meetSearchForm: FormGroup;

  public formReady = false;
  public meetsSearchForm: FormGroup;
  public refinedMeets: Meet[];

  constructor(
    private meetService: MeetsService,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private leagueService: LeagueService
  ) {}

  ngOnInit() {
    this.initForm();
    this.meetReady = true;
    // this.route.params.subscribe((params: Params) => {
    //   if (params.hasOwnProperty('id')) {
    //     this.meetId = params.id;
        // this.meetReady = true;
        this.getData().subscribe(res => {
          console.log(res);
          this.loader.close();
          this.meetsReady = true;
          this.meets = res[0];
          // this.meetRegistrants = res;
          
          this.changeDetectorRef.detectChanges();
        });
      // } else {
      // }
    // });
  }

  private getData(): Observable<any> {
    // add find function to find all meets that are in request status
    let meets = this.meetService.getMeets();
    return forkJoin([meets]);
  }

  private setValues() {}

  // private getData(): Observable<any> {
  //   // const league = this.leagueService.getLeague();
  //   // const meet = this.meetService.findMeet(this.meetId);
  //   // return forkJoin([meet]);
  // }

  private onFormChanges(): void {
    // this.meetsSearchForm.valueChanges.subscribe(val => {
    //   console.log(val);
    //   this.filterMeets(this.meetsSearchForm.value);
    // });
    // on division changes change available age classes
    // on gender changes change available weight classes
  }

  private filterMeets(sortedMeets: any): void {
    let sortedMeetsList = [];
    let isMatch: boolean;

    for (let i = 0; i < this.registrations.length; i++) {
      isMatch = false;
      if (true) {
        for (const property in sortedMeets) {
          if (true) {
            if (this.registrations[i].hasOwnProperty(property)) {
              if (
                sortedMeets[property] === 'all' ||
                this.registrations[i][property] ===
                  sortedMeets[property]
              ) {
                isMatch = true;
              } else {
                isMatch = false;
                break;
              }
            } else if (sortedMeets[property] === 'all') {
              isMatch = true;
            } else {
              isMatch = false;
              break;
            }
          }
        }
        if (isMatch === true) {
          sortedMeetsList.push(this.registrations[i]);
        }
      }
    }
    this.refinedMeets = sortedMeetsList;
  }

  public clearSearch(): void {
    this.meetsSearchForm.patchValue({});
  }

  private setFormValues() {}

  private initForm() {
    this.loader.close();
    this.formReady = true;

    this.meetSearchForm = this.fb.group({
      
    });
    this.onFormChanges();
  }

  openPopUp(data: any, isNew?) {
    let title = isNew ? 'Add New Record' : 'Update Record';
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      MeetRequestsPopupComponent,
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
      if (isNew) {
        console.log('new');
        this.snack.open('Record Added!', 'OK', { duration: 4000 });
        // this.crudService.addItem(res)
        //   .subscribe(data => {
        //     this.items = data;
        //     this.loader.close();
        //     this.snack.open('Member Added!', 'OK', { duration: 4000 })
        //   })
      } else {
        console.log('update');
        this.loader.close();
        this.snack.open('Record Updated!', 'OK', { duration: 4000 });
        // this.crudService.updateItem(data._id, res)
        //   .subscribe(data => {
        //     this.items = data;
        //     this.loader.close();
        //     this.snack.open('Member Updated!', 'OK', { duration: 4000 })
        //   });
      }
    });
  }
}
