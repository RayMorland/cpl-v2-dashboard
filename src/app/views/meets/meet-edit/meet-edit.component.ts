/*
  Title: meet-edit.component.ts
  Created by: Raymond Morland
  Project: CPL Admin Website
*/

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  MinLengthValidator,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Meet } from 'app/shared/models/meet.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { FileUploader } from 'ng2-file-upload';
import { Observable, forkJoin } from 'rxjs';
import { PlatformService } from 'app/shared/services/platform/platform.service';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { League } from 'app/shared/models/league.model';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { dateValidator, atLeastOneSelected } from 'app/shared/helpers/validators';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-meet-edit',
  templateUrl: './meet-edit.component.html',
  styleUrls: ['./meet-edit.component.scss'],
  animations: [egretAnimations]
})
export class MeetEditComponent implements OnInit {
  public formReady: Boolean = false;
  private editMode: Boolean = false;
  private meet: Meet;
  private meetId: string;
  public meetReady = false;
  private meetForm: FormGroup;
  public cplCoordinators: Coordinator[] = [];
  private league: League;
  public step = 0;

  public uploader: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: Boolean = false;

  public meetCategoriesSelected = [];
  public meetTestsSelected: any = [];
  public meetEventsSelected: any = [];

  public categoriesSelected: Boolean = true;
  public testsSelected: Boolean = true;
  public eventsSelected: Boolean = true;
  public eventsComplete: Boolean = true;

  public generalInfoValid: Boolean = false;
  public generalInfoCompletedOnce: Boolean = false;
  private meetInfoValid: Boolean = false;
  private meetInfoCompletedOnce: Boolean = false;
  public venueInfoValid: Boolean = false;
  private venueInfoCompletedOnce: Boolean = false;
  public weighInInfoValid: Boolean = false;
  private weighInInfoCompletedOnce: Boolean = false;
  public accommodationInfoValid: Boolean = false;
  private accommodationInfoCompletedOnce: Boolean = false;
  public feesInfoValid: Boolean = false;
  private feesInfoCompletedOnce: Boolean = false;

  private dp = new DatePipe(navigator.language);
  private p = 'yyyy-MM-ddTHH:mm';

  constructor(
    private fb: FormBuilder,
    private meetService: MeetsService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private coordinatorService: CoordinatorsService,
    public platformService: PlatformService,
    public leagueService: LeagueService // private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.loader.open();
    // this.league = new League();
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.editMode = true;
        this.meetId = params.id;
        this.getData().subscribe((res) => {
          this.league = new League(res[2][0]);
          this.initForm();
          this.meet = new Meet(res[0][0]);
          res[1].forEach((coordinator) =>
            this.cplCoordinators.push(coordinator)
          );
          this.setFormValues();
          this.meetReady = true;
          this.changeDetectorRef.detectChanges();
          this.loader.close();
        });
      } else {
        this.getData().subscribe((res) => {
          this.league = new League(res[1][0]);
          this.initForm();
          this.meet = new Meet();
          res[0].forEach((coordinator) =>
            this.cplCoordinators.push(coordinator)
          );
          this.meetReady = true;
          this.changeDetectorRef.detectChanges();
          this.loader.close();
        });
      }
    });
  }

  private getData(): Observable<any> {
    if (this.editMode) {
      const meet = this.meetService.findMeet(this.meetId);
      const coordinators = this.coordinatorService.getCoordinators();
      const league = this.leagueService.getLeague();
      return forkJoin([meet, coordinators, league]);
    } else {
      const coordinators = this.coordinatorService.getCoordinators();
      const league = this.leagueService.getLeague();
      return forkJoin([coordinators, league]);
    }
  }

  private onFormChanges(): void {
    this.meetForm.valueChanges.subscribe((val) => {
      // if (
      //   val.weighInInfo.weighInLocationSameAsMeet
      // ) {
      //   this.weighInName.setValue(this.venueName.value);
      //   this.weighInCity.setValue(this.venueCity.value);
      //   this.weighInProvince.setValue(this.venueProvince.value);
      //   this.weighInCountry.setValue(this.venueCountry.value);
      //   this.weighInStreet.setValue(this.venueStreet.value);
      //   this.weighInPostal.setValue(this.venuePostal.value);
      // }

      if (
        this.meetForm.get('capacity').valid &&
        this.meetForm.get('title').valid &&
        this.meetForm.get('capacity').valid &&
        this.meetForm.get('releaseDate').valid &&
        this.meetForm.get('subtitle').valid &&
        this.meetForm.get('description').valid &&
        this.meetForm.get('dates').valid &&
        this.meetForm.get('capacity').valid &&
        this.meetForm.get('registrationClosingDate').valid
      ) {
        this.generalInfoValid = true;
        this.generalInfoCompletedOnce = true;
      } else {
        this.generalInfoValid = false;
      }

      // Validator for having to select at least one of each category, testing, and lift

      this.meetInfoValid =
        this.categories.value && this.testing.valid && this.events.valid;
      if (this.meetInfoValid && !this.meetInfoCompletedOnce) {
        this.meetInfoCompletedOnce = true;
      }

      if (this.meetForm.get('venue').valid) {
        this.venueInfoValid = true;
        if (!this.venueInfoCompletedOnce) {
          this.venueInfoCompletedOnce = true;
        }
      }
      if (this.meetForm.get('weighInInfo').valid) {
        this.weighInInfoValid = true;
        if (!this.weighInInfoCompletedOnce) {
          this.weighInInfoCompletedOnce = true;
        }
      }
      if (this.meetForm.get('accommodation').valid) {
        this.accommodationInfoValid = true;
        if (!this.accommodationInfoCompletedOnce) {
          this.accommodationInfoCompletedOnce = true;
        }
      }
      if (this.meetForm.get('merchandise').valid) {
        this.feesInfoValid = true;
        if (!this.feesInfoCompletedOnce) {
          this.feesInfoCompletedOnce = true;
        }
      }
    });
  }

  public submitForm(): void {
    this.meet.coordinator._id = this.coordinator.value;
    this.meet.coordinator.name = this.cplCoordinators.find(
      (coord) => coord._id === this.meet.coordinator._id
    ).name;
    this.meet.coordinator.stripeId = this.cplCoordinators.find(
      (coord) => coord._id === this.meet.coordinator._id
    ).stripeId;
    this.meet.releaseDate = this.releaseDate.value;
    this.meet.title = this.title.value;
    this.meet.subtitle = this.subtitle.value;
    this.meet.description = this.description.value;
    // this.meet.images = this.meetForm.get('images').value;
    this.meet.images = ['https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'];
    this.meet.dates = this.dates.value;

    let categories = [];
    this.meetForm.get('eventInfo.categories').value.forEach((cat, index) => {
      if (cat) {
        categories.push(this.league.categories[index]);
        this.meet.eventInfo.categories = categories;
      }
    });
    let events = [];
    this.meetForm.get('eventInfo.events').value.forEach((lift, index) => {
      if (lift.type) {
        events.push(this.league.events[index]);
        this.meet.eventInfo.events = events;
        console.log(this.meet.eventInfo.events);
      }
    });
    let tests = [];
    this.meetForm.get('eventInfo.testing').value.forEach((test, index) => {
      if (test.type) {
        tests.push(this.league.tests[index]);
        this.meet.eventInfo.testing = tests;
      }
    });

    this.meet.weighInInfo = this.meetForm.get('weighInInfo').value;
    this.meet.venue = this.meetForm.get('venue').value;
    this.meet.accommodation = this.meetForm.get('accommodation').value;

    this.meet.registrationFormLink = this.meetForm.get(
      'registrationFormLink'
    ).value;
    this.meet.capacity = this.meetForm.get('capacity').value;
    this.meet.registrationClosingDate = this.meetForm.get(
      'registrationClosingDate'
    ).value;
    this.meet.additionalInfo = this.meetForm.get('additionalInfo').value;
    this.meet.resultsDocumentUrl = this.meetForm.get(
      'resultsDocumentUrl'
    ).value;
    // this.meet.tags = this.meetForm.get('tags').value;
    this.meet.merchandise = this.meetForm.get('merchandise').value;
    this.meet.registrationFormLink = this.meetForm.get(
      'registrationFormLink'
    ).value;
    // this.meet.fees = this.meetForm.get('fees').value;

    if (this.editMode) {
      if (confirm('Are you sure you want to update this meet?')) {
        this.meetService.updateMeet(this.meet._id, this.meet).subscribe(
          (res) => {
            this.router.navigate(['/meets/' + res._id]);
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
      }
    } else {
      if (confirm('Are you sure you want to create this meet?')) {
        this.meet.status = 'created';
        this.meet.registrationClosed = true;
        this.meetService.createMeet(this.meet).subscribe(
          (res) => {
            this.router.navigate(['/meets/' + res._id]);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }

  private setFormValues(): void {
    this.title.setValue(this.meet.title);
    this.subtitle.setValue(this.meet.subtitle);
    this.description.setValue(this.meet.description);
    this.coordinator.setValue(this.meet.coordinator._id);
    // this.meetForm.get('dates').setValue(this.meet.dates);
    this.capacity.setValue(this.meet.capacity);

    const releaseDateLocal = this.dp.transform(this.meet.releaseDate, this.p);
    this.releaseDate.setValue(releaseDateLocal);
    const regCloseDateLocal = this.dp.transform(
      this.meet.registrationClosingDate,
      this.p
    );
    this.registrationClosingDate.setValue(regCloseDateLocal);

    let meetDatesValues = [];
    this.meet.dates.forEach((date, index) => {
      const dateStart = this.dp.transform(date.start, this.p);
      const dateEnd = this.dp.transform(date.end, this.p);
      meetDatesValues.push({ start: dateStart, end: dateEnd });
    });
    this.dates.setValue(meetDatesValues);

    console.log(this.league.events, this.meet);

    this.league.events.forEach((lift, index) => {
      this.meetEventsSelected[index] = { type: false, price: lift.price };
      this.meet.eventInfo.events.forEach((meetLift, index2) => {
        if (lift.type === meetLift.type) {
          this.meetEventsSelected[index] = { type: true, price: meetLift.price };
        } else {
          this.meetEventsSelected[index] = { type: false, price: meetLift.price };
        }
      });
    });

    this.league.categories.forEach((cat, index) => {
      this.meet.eventInfo.categories.forEach((meetCat) => {
        if (cat === meetCat) {
          this.meetCategoriesSelected[index] = true;
        } else {
          this.meetCategoriesSelected[index] = false;
        }
      });
    });
    this.league.tests.forEach((test, index) => {
      this.meet.eventInfo.testing.forEach((meetTest, index2) => {
        console.log(test, meetTest);
        if (test.type === meetTest.type) {
          this.meetTestsSelected[index] = { type: true, price: meetTest.price };
        } else {
          this.meetTestsSelected[index] = { type: false, price: meetTest.price };
        }
      });
    });

    console.log(this.meetEventsSelected);

    this.events.setValue(this.meetEventsSelected);
    this.categories.setValue(this.meetCategoriesSelected);
    this.testing.setValue(this.meetTestsSelected);
    this.venueCity.setValue(this.meet.venue.location.address.city);
    this.venueCountry.setValue(this.meet.venue.location.address.country);
    this.venueProvince.setValue(this.meet.venue.location.address.province);
    this.venuePostal.setValue(this.meet.venue.location.address.postal);
    this.venueStreet.setValue(this.meet.venue.location.address.street);
    this.venueName.setValue(this.meet.venue.location.name);
    this.venueInfo.setValue(this.meet.venue.info);
    this.meet.dates.forEach((date, index) => {
      const dateStart = this.dp.transform(date.start, this.p);
      const dateEnd = this.dp.transform(date.end, this.p);
      meetDatesValues.push({ start: dateStart, end: dateEnd });
    });
    this.weighInTimes.setValue({
      start: this.dp.transform(this.meet.weighInInfo.times.start, this.p),
      end: this.dp.transform(this.meet.weighInInfo.times.end, this.p),
    });
    this.weighInCity.setValue(this.meet.weighInInfo.location.address.city);
    this.weighInCountry.setValue(
      this.meet.weighInInfo.location.address.country
    );
    this.weighInProvince.setValue(
      this.meet.weighInInfo.location.address.province
    );
    this.weighInPostal.setValue(this.meet.weighInInfo.location.address.postal);
    this.weighInStreet.setValue(this.meet.weighInInfo.location.address.street);
    this.weighInName.setValue(this.meet.weighInInfo.location.name);
    this.weighInInfo.setValue(this.meet.weighInInfo.info);
    this.accommodationCity.setValue(
      this.meet.accommodation.location.address.city
    );
    this.accommodationCountry.setValue(
      this.meet.accommodation.location.address.country
    );
    this.accommodationProvince.setValue(
      this.meet.accommodation.location.address.province
    );
    this.accommodationPostal.setValue(
      this.meet.accommodation.location.address.postal
    );
    this.accommodationStreet.setValue(
      this.meet.accommodation.location.address.street
    );
    this.accommodationName.setValue(this.meet.accommodation.location.name);
    this.accommodationInfo.setValue(this.meet.accommodation.info);

    this.meet.merchandise.forEach((merch) => {
      this.merchandise.push(
        this.fb.group({
          item: [
            merch.item,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          description: [
            merch.description,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          price: [merch.price, [Validators.required, Validators.min(0)]],
        })
      );
    });
  }

  private initForm(): void {
    const meetEvents = this.league.events.map(
      (control) =>
        new FormGroup(
          {
            type: new FormControl(false),
            price: new FormControl(control.price),
          },
          this.priceGreaterThanZero
        )
    );
    const meetTests = this.league.tests.map(
      (control) =>
        new FormGroup(
          {
            type: new FormControl(false),
            price: new FormControl(control.price),
          },
          this.priceGreaterThanZero
        )
    );
    const meetCategories = this.league.categories.map(
      (control) => new FormControl(false)
    );

    this.formReady = true;

    this.meetForm = this.meetForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      subtitle: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      coordinator: ['', [Validators.required]],
      capacity: [
        null,
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      releaseDate: [null, [Validators.required, dateValidator]],
      dates: this.fb.array(
        [
          this.fb.group({
            start: [null, [Validators.required, dateValidator]],
            end: [null, [Validators.required, dateValidator]],
          }),
        ],
        [Validators.minLength(1)]
      ),
      registrationFormLink: [''],
      registrationClosingDate: [
        null,
        [Validators.required, dateValidator],
      ],
      images: this.fb.array([this.fb.control('')]),
      eventInfo: this.fb.group({
        categories: this.fb.array(meetCategories, atLeastOneSelected),
        testing: this.fb.array(meetTests, this.atLeastOneSelectedByType),
        events: this.fb.array(meetEvents, this.atLeastOneSelectedByType),
      }),
      weighInInfo: this.fb.group({
        info: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        // weighInLocationSameAsMeet: [false],
        times: this.fb.group({
          start: [null, [Validators.required, dateValidator]],
          end: [null, [Validators.required, dateValidator]],
        }),
        location: this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          address: this.fb.group({
            street: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            city: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            province: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postal: ['', [Validators.required, this.postalCodeValidator]],
          }),
        }),
      }),
      venue: this.fb.group({
        info: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        link: [''],
        location: this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          address: this.fb.group({
            street: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            city: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            province: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postal: ['', [Validators.required, this.postalCodeValidator]],
          }),
        }),
      }),
      accommodation: this.fb.group({
        info: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        link: [''],
        location: this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          address: this.fb.group({
            street: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            city: [
              '',
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
              ],
            ],
            province: ['', [Validators.required]],
            country: ['', [Validators.required]],
            postal: ['', [Validators.required, this.postalCodeValidator]],
          }),
        }),
      }),
      merchandise: this.fb.array([]),
      resultsDocumentUrl: [''],
      additionalInfo: [''],
    });

    this.onFormChanges();
  }

  private get title() {
    return this.meetForm.get('title');
  }

  private get subtitle() {
    return this.meetForm.get('subtitle');
  }

  private get description() {
    return this.meetForm.get('description');
  }

  private get coordinator() {
    return this.meetForm.get('coordinator');
  }

  private get capacity() {
    return this.meetForm.get('capacity');
  }

  private get releaseDate() {
    return this.meetForm.get('releaseDate');
  }

  private get registrationClosingDate() {
    return this.meetForm.get('registrationClosingDate');
  }

  private get meetDates() {
    return this.meetForm.get('dates') as FormArray;
  }

  private get categories() {
    return this.meetForm.get('eventInfo.categories') as FormArray;
  }

  private get events() {
    return this.meetForm.get('eventInfo.events') as FormArray;
  }

  private get testing() {
    return this.meetForm.get('eventInfo.testing') as FormArray;
  }

  private get dates() {
    return this.meetForm.get('dates') as FormArray;
  }

  private get venueName() {
    return this.meetForm.get('venue.location.name');
  }

  private get venueStreet() {
    return this.meetForm.get('venue.location.address.street');
  }

  private get venueCity() {
    return this.meetForm.get('venue.location.address.city');
  }

  private get venueProvince() {
    return this.meetForm.get('venue.location.address.province');
  }

  private get venueCountry() {
    return this.meetForm.get('venue.location.address.country');
  }

  private get venuePostal() {
    return this.meetForm.get('venue.location.address.postal');
  }

  private get venueInfo() {
    return this.meetForm.get('venue.info');
  }

  private get weighInName() {
    return this.meetForm.get('weighInInfo.location.name');
  }

  private get weighInTimes() {
    return this.meetForm.get('weighInInfo.times');
  }

  private get weighInStreet() {
    return this.meetForm.get('weighInInfo.location.address.street');
  }

  private get weighInCity() {
    return this.meetForm.get('weighInInfo.location.address.city');
  }

  private get weighInProvince() {
    return this.meetForm.get('weighInInfo.location.address.province');
  }

  private get weighInCountry() {
    return this.meetForm.get('weighInInfo.location.address.country');
  }

  private get weighInPostal() {
    return this.meetForm.get('weighInInfo.location.address.postal');
  }

  private get weighInInfo() {
    return this.meetForm.get('weighInInfo.info');
  }

  private get accommodationName() {
    return this.meetForm.get('accommodation.location.name');
  }

  private get accommodationStreet() {
    return this.meetForm.get('accommodation.location.address.street');
  }

  private get accommodationCity() {
    return this.meetForm.get('accommodation.location.address.city');
  }

  private get accommodationProvince() {
    return this.meetForm.get('accommodation.location.address.province');
  }

  private get accommodationCountry() {
    return this.meetForm.get('accommodation.location.address.country');
  }

  private get accommodationPostal() {
    return this.meetForm.get('accommodation.location.address.postal');
  }

  private get accommodationInfo() {
    return this.meetForm.get('accommodation.info');
  }

  private get times() {
    return this.meetForm.get('weighInInfo.times') as FormArray;
  }

  private get tags() {
    return this.meetForm.get('tags') as FormArray;
  }

  private get merchandise() {
    return this.meetForm.get('merchandise') as FormArray;
  }

  // Custom Validators

  private atLeastOneSelectedByType(
    c: FormArray
  ): { [key: string]: boolean } | null {
    if (c.controls.filter((control) => control.value.type).length > 0) {
      return null;
    }
    return { atLeastOneSelected: true };
  }

  private priceGreaterThanZero(
    c: FormGroup
  ): { [key: string]: boolean } | null {
    if (c.value.type) {
      if (c.value.price >= 0) {
        return null;
      }
      return { priceLessThanZero: true };
    }
    return null;
  }

  private postalCodeValidator(
    c: FormControl
  ): { [key: string]: boolean } | null {
    let regex =
      '[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]';
    if (c.value != null && c.value.match(regex)) {
      return null;
    }
    return { postalCodeInvalid: true };
  }

  public addDate(): void {
    this.dates.push(
      this.fb.group({
        start: [null, [Validators.required, dateValidator]],
        end: [null, [Validators.required, dateValidator]],
      })
    );
  }

  public addTime(): void {
    this.times.push(
      this.fb.group({
        start: [null, [Validators.required, dateValidator]],
        end: [null, [Validators.required, dateValidator]],
      })
    );
  }

  public addMerchandise(): void {
    this.merchandise.push(
      this.fb.group({
        item: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        description: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        price: [null, [Validators.required, Validators.min(0)]],
      })
    );
  }

  public addTag(): void {
    this.tags.push(this.meetForm.value.tags);
  }

  public removeDate(index): void {
    if (this.dates.length > 1) {
      this.dates.removeAt(index);
    }
  }

  public removeTime(index): void {
    this.times.removeAt(index);
  }

  public removeMerchandise(index): void {
    this.merchandise.removeAt(index);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
