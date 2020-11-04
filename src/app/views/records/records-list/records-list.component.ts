import { Component, OnInit, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Record } from 'app/shared/models/record.model';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { RecordsService } from 'app/shared/services/records/records.service';
import { RecordEditPopupComponent } from './record-edit-popup/record-edit-popup.component';
import { League } from 'app/shared/models/league.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { forkJoin, Observable } from 'rxjs';
import { PlatformService } from 'app/shared/services/platform/platform.service';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss'],
  animations: [egretAnimations]
})
export class RecordsListComponent implements OnInit, OnDestroy {
  public currentPage: any;
  public error: string;

  public records: Record[];
  public recordsReady = false;
  public recordsListReady = false;
  public recordSearchForm: FormGroup;
  public formReady = false;
  public league: League;
  public divisions = [];
  public genders = [];
  public categories = [];
  public ageClasses = [];
  public weightClasses = [];
  public recordTypes = [];
  public testing = [];
  public provinces = [];
  public provincialOrNational = ['National', 'Provincial'];

  public filteredRecords: Record[];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private recordsService: RecordsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private leagueService: LeagueService,
    private platform: PlatformService,
    // private crudService: CrudService,
    // private confirmService: AppConfirmService,
  ) { }

  ngOnInit() {
    this.loader.open();
    this.initForm();
    this.getData().subscribe(res => {
      this.records = res[0];
      console.log(this.records);
      this.filteredRecords = this.records;
      this.league = new League(res[1][0]);
      // change age class based on which division is selected
      this.divisions = this.league.divisions;
      // change weigh classes based on which gender is selected
      this.genders = this.league.genders;
      this.categories = this.league.categories;
      this.testing = this.league.tests;
      this.league.events.forEach(event => {
        this.recordTypes.push(event.type);
      });
      // this.setValues();
      this.loader.close();
      this.recordsReady = true;
      this.recordsListReady = true;
      this.setFormValues();
      this.changeDetectorRef.detectChanges();
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy() {

  }

  private getData(): Observable<any> {
    // const league = this.leagueService.getLeague();
    const records = this.recordsService.getRecords();
    const league = this.leagueService.getLeague();
    return forkJoin([records, league]);
  }

  private setValues() {
    this.divisions = this.league.divisions;
    this.genders = this.league.genders;
    this.categories = this.league.categories;
    this.ageClasses = this.league.divisions[0].ageClasses;
    // this.weightClasses = this.league.weightClasses;
    this.recordTypes = this.league.events;
    this.testing = this.league.tests;
  }

  private onFormChanges(): void {
    this.recordSearchForm.valueChanges.subscribe(val => {
      console.log(val);
      this.filterRecords(this.recordSearchForm.value);
    });
    // on division changes change available age classes
    // on gender changes change available weight classes
  }

  private filterRecords(searchedRecords: any): void {
    let sortedRecords = [];
    let isMatch: boolean;

    console.log(this.filteredRecords);

    for (let i = 0; i < this.records.length; i++) {
      isMatch = false;
      if (true) {
        for (const property in searchedRecords) {
          if (true) {
            if (this.records[i].hasOwnProperty(property)) {
              if (searchedRecords[property] === 'all' || this.records[i][property] === searchedRecords[property]) {
                isMatch = true;
              } else {
                isMatch = false;
                break;
              }
            } else if (searchedRecords[property] === 'all') {
              isMatch = true;
            } else {
              isMatch = false;
              break;
            }
          }
        }
        if (isMatch === true) {
          sortedRecords.push(this.records[i]);
        }
      }
    }
    // this.filteredRecords = sortedRecords;
  }

  public clearSearch(): void {
    this.recordSearchForm.patchValue({
      division: 'all',
      gender: 'all',
      category: 'all',
      drugTest: 'all',
      weightClass: 'all',
      ageClass: 'all',
      recordtype: 'all',
      showActiveRecords: false
    });
  }

  private setFormValues() {

  }

  private initForm() {
    this.loader.close();
    this.formReady = true;

    this.recordSearchForm = this.fb.group({
      division: ['all'],
      gender: ['all'],
      category: ['all'],
      drugTest: ['all'],
      weightClass: ['all'],
      ageClass: ['all'],
      recordType: ['all'],
      provincialOrNational: ['all'],
      province: ['all'],
      showActiveRecords: [false]
    });
    this.onFormChanges();

    this.divisionControl.valueChanges.subscribe(res => {
      this.ageClasses = res.ageClasses;
    });

    this.genderControl.valueChanges.subscribe(res => {
      this.weightClasses = res.weightClasses;
    });
  }

  get divisionControl() {
    return this.recordSearchForm.get('division');
  }

  get genderControl() {
    return this.recordSearchForm.get('gender');
  }

  get categoryControl() {
    return this.recordSearchForm.get('category');
  }

  get drugTestControl() {
    return this.recordSearchForm.get('drugTest');
  }

  get weightClassControl() {
    return this.recordSearchForm.get('weightClass');
  }

  get ageClassControl() {
    return this.recordSearchForm.get('ageClass');
  }

  get recordTypeControl() {
    return this.recordSearchForm.get('recordType');
  }

  get provincialOrNationalControl() {
    return this.recordSearchForm.get('provincialOrNational');
  }

  get provinceControl() {
    return this.recordSearchForm.get('province');
  }

  openPopUp(data: any, isNew?) {
    let title = isNew ? 'Add New Record' : 'Update Record';
    let dialogRef: MatDialogRef<any> = this.dialog.open(RecordEditPopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, editMode: !isNew }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.recordsListReady = false;
        if (isNew) {
          console.log("new");
          this.recordsService.getRecords().subscribe(res => {
            this.filteredRecords = res;
            this.recordsListReady = true;
            this.snack.open('Record Added!', 'OK', { duration: 4000 });
          });
        } else {
          console.log("update");
          this.recordsService.getRecords().subscribe(res => {
            this.filteredRecords = res;
            this.recordsListReady = true;
            this.snack.open('Record Updated!', 'OK', { duration: 4000 });
          });
        }
      });
  }
}
