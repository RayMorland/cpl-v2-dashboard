import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { LeagueService } from 'app/shared/services/league/league.service';
import { PlatformService } from 'app/shared/services/platform/platform.service';
import { forkJoin, Observable } from 'rxjs';
import { League } from 'app/shared/models/league.model';

@Component({
  selector: 'app-league-edit-popup',
  templateUrl: './league-edit-popup.component.html',
  styleUrls: ['./league-edit-popup.component.scss'],
})
export class LeagueEditPopupComponent implements OnInit {
  private invoiceReady = false;
  private editMode = false;
  public loaderOpen = true;
  private title;
  private league: League;
  public leagueEditForm: FormGroup;

  public officialTypes = [
    'National Referee',
    'Provincial Referee',
    'International Referee',
    'Director',
    'Record Keeper',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LeagueEditPopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.title = this.data.title.toLowerCase();
    this.league = this.data.league;
    console.log(this.data);
    this.initForm();
    this.setFormValues();
    this.changeDetectorRef.detectChanges();
  }

  private initForm(): void {
    if (this.title === 'divisions') {
      this.leagueEditForm = this.fb.group({
        divisions: this.fb.array([]),
      });
    } else if (this.title === 'officials') {
      this.leagueEditForm = this.fb.group({
        officials: this.fb.array([]),
      });
    } else if (this.title === 'categories') {
      this.leagueEditForm = this.fb.group({
        categories: this.fb.array([]),
      });
    } else if (this.title === 'genders') {
      this.leagueEditForm = this.fb.group({
        genders: this.fb.array([]),
      });
    } else if (this.title === 'testing') {
      this.leagueEditForm = this.fb.group({
        testing: this.fb.array([]),
      });
    } else if (this.title === 'events') {
      this.leagueEditForm = this.fb.group({
        events: this.fb.array([]),
      });
    } else if (this.title === 'movements') {
      this.leagueEditForm = this.fb.group({
        movements: this.fb.array([]),
      });
    }

    this.loaderOpen = false;
  }

  private setFormValues(): void {
    if (this.title === 'divisions') {
      this.league.divisions.forEach((division, index) => {
        (this.leagueEditForm.get('divisions') as FormArray).push(
          this.fb.group({
            name: [division.name],
            ageClasses: this.fb.array([]),
          })
        );
        division.ageClasses.forEach((ageClass) => {
          ((this.leagueEditForm.get('divisions') as FormArray).controls[
            index
          ].get('ageClasses') as FormArray).push(
            this.fb.group({
              min: [ageClass.min],
              max: [ageClass.max],
            })
          );
        });
      });
    } else if (this.title === 'officials') {
      this.league.officials.forEach((official, index) => {
        (this.leagueEditForm.get('officials') as FormArray).push(
          this.fb.group({
            name: [official.name],
            type: [official.type],
          })
        );
      });
    } else if (this.title === 'categories') {
      this.league.categories.forEach((category, index) => {
        (this.leagueEditForm.get('categories') as FormArray).push(
          this.fb.group({
            name: [category],
          })
        );
      });
    } else if (this.title === 'genders') {
      this.league.genders.forEach((gender, index) => {
        (this.leagueEditForm.get('genders') as FormArray).push(
          this.fb.group({
            name: [gender.name],
            weightClasses: this.fb.array([]),
          })
        );
        gender.weightClasses.forEach((weightClass) => {
          ((this.leagueEditForm.get('genders') as FormArray).controls[
            index
          ].get('weightClasses') as FormArray).push(
            this.fb.group({
              name: [weightClass.name],
              weightRange: this.fb.group({
                min: [null],
                max: [null],
              }),
            })
          );
        });
      });
    } else if (this.title === 'testing') {
      this.league.tests.forEach((test, index) => {
        (this.leagueEditForm.get('testing') as FormArray).push(
          this.fb.group({
            type: [test.type],
            price: [test.price],
          })
        );
      });
    } else if (this.title === 'events') {
      this.league.events.forEach((event, index) => {
        (this.leagueEditForm.get('events') as FormArray).push(
          this.fb.group({
            type: [event.type],
            price: [event.price],
            movements: [event.movements],
          })
        );
      });
    } else if (this.title === 'movements') {
      this.league.movements.forEach((movement, index) => {
        (this.leagueEditForm.get('movements') as FormArray).push(
          this.fb.group({
            name: [movement],
          })
        );
      });
    }
  }

  // Division specific functions

  public addDivision(): void {
    (this.leagueEditForm.get('divisions') as FormArray).push(
      this.fb.group({
        name: [''],
        ageClasses: this.fb.array([]),
      })
    );
  }

  public removeDivision(i): void {
    (this.leagueEditForm.get('divisions') as FormArray).removeAt(i);
  }

  public addAgeClass(i): void {
    ((this.leagueEditForm.get('divisions') as FormArray).controls[i].get(
      'ageClasses'
    ) as FormArray).push(
      this.fb.group({
        min: [null],
        max: [null],
      })
    );
  }

  public removeAgeClass(i, j): void {
    ((this.leagueEditForm.get('divisions') as FormArray).controls[i].get(
      'ageClasses'
    ) as FormArray).removeAt(j);
  }

  // Officials specific functions

  public addOfficial(): void {
    (this.leagueEditForm.get('officials') as FormArray).push(
      this.fb.group({
        name: [''],
        type: [''],
      })
    );
  }

  public removeOfficial(i): void {
    (this.leagueEditForm.get('officials') as FormArray).removeAt(i);
  }

  // Categories specific function

  public addCategory(): void {
    (this.leagueEditForm.get('categories') as FormArray).push(
      this.fb.group({
        name: [''],
      })
    );
  }

  public removeCategory(i): void {
    (this.leagueEditForm.get('categories') as FormArray).removeAt(i);
  }

  // Genders specific functions

  public addGender(): void {
    (this.leagueEditForm.get('genders') as FormArray).push(
      this.fb.group({
        name: [''],
        weightClasses: this.fb.array([]),
      })
    );
  }

  public removeGender(i): void {
    (this.leagueEditForm.get('genders') as FormArray).removeAt(i);
  }

  public addWeightClass(i): void {
    ((this.leagueEditForm.get('genders') as FormArray).controls[i].get(
      'weightClasses'
    ) as FormArray).push(
      this.fb.group({
        name: [''],
        weightRange: this.fb.group({
          min: [null],
          max: [null],
        }),
      })
    );
  }

  public removeWeightClass(i, j): void {
    ((this.leagueEditForm.get('genders') as FormArray).controls[i].get(
      'weightClasses'
    ) as FormArray).removeAt(j);
  }

  // Testing specific functions

  public addTest(): void {
    (this.leagueEditForm.get('testing') as FormArray).push(
      this.fb.group({
        type: [''],
        price: [null],
      })
    );
  }

  public removeTest(i): void {
    (this.leagueEditForm.get('testing') as FormArray).removeAt(i);
  }

  // Events specific functions

  public addEvent(): void {
    (this.leagueEditForm.get('events') as FormArray).push(
      this.fb.group({
        type: [''],
        price: [null],
        movements: this.fb.array([]),
      })
    );
  }

  public removeEvent(i): void {
    (this.leagueEditForm.get('events') as FormArray).removeAt(i);
  }

  public addMovementToEvent(i): void {
    ((this.leagueEditForm.get('events') as FormArray).controls[i].get(
      'movements'
    ) as FormArray).push(
      this.fb.group({
        name: [''],
      })
    );
  }

  public removeMovementFromEvent(i, j): void {
    ((this.leagueEditForm.get('events') as FormArray).controls[i].get(
      'movements'
    ) as FormArray).removeAt(j);
  }

  // Movements specific functions

  // Submit League Edit Form
  public submitForm(): void {
    if (this.title === 'divisions') {
      this.league.divisions = [];
      this.league.divisions = this.leagueEditForm.get('divisions').value;
    } else if (this.title === 'officials') {
      this.league.officials = [];
      this.league.officials = this.leagueEditForm.get('officials').value;
    } else if (this.title === 'categories') {
      this.league.categories = [];
      (this.leagueEditForm.get('categories') as FormArray).controls.forEach(
        (cat) => {
          this.league.categories.push(cat.value.name);
        }
      );
    } else if (this.title === 'genders') {
      this.league.genders = [];
      this.league.genders = this.leagueEditForm.get('genders').value;
    } else if (this.title === 'testing') {
      console.log(this.leagueEditForm.value);
      this.league.tests = [];
      this.league.tests = this.leagueEditForm.get('testing').value;
    } else if (this.title === 'events') {
      this.league.events = [];
      (this.leagueEditForm.get('events') as FormArray).controls.forEach(
        (event) => {
          console.log(event);
          this.league.events.push({
            type: event.value.type,
            price: event.value.price,
            movements: event.value.movements,
          });
        }
      );
    } else if (this.title === 'movements') {
      this.league.movements = [];
      (this.leagueEditForm.get('movements') as FormArray).controls.forEach(
        (movement) => {
          this.league.movements.push(movement.value.name);
        }
      );
    }

    console.log(this.league);

    this.leagueService.updateLeague(this.league).subscribe(
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
