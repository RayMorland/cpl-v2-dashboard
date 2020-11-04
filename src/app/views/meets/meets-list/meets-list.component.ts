import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatSnackBar, MatSidenav } from "@angular/material";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subscription, Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { MeetsService } from "../../../shared/services/meets/meets.service";
import { Meet } from "app/shared/models/meet.model";
import { LeagueService } from "app/shared/services/league/league.service";
import { MembersService } from "app/shared/services/members/members.service";
import { RegistrationService } from "app/shared/services/registrations/registration.service";
import { CoordinatorsService } from "app/shared/services/coordinators/coordinators.service";
import { FilterMeetsPipe } from "app/shared/pipes/filter-meets.pipe";
import { PlatformService } from "app/shared/services/platform/platform.service";

@Component({
  selector: "app-meets-list",
  templateUrl: "./meets-list.component.html",
  styleUrls: ["./meets-list.component.scss"],
  animations: [egretAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetsListComponent implements OnInit, OnDestroy, OnChanges {
  public currentPage: any;

  public meets$: Observable<Meet[]>;
  public categories$: Observable<any>;
  public activeCategory: string = "all";
  public filterForm: FormGroup;
  public meetsList: Meet[];
  public meetsReady = false;
  public currentYear = new Date().getFullYear();
  public years = [];

  public defaultImage =
    "https://images.unsplash.com/photo-1517344687790-7338f238f7f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80";

  public meetRegistrations = [];

  searchString = "";
  completed = null;
  coordinator = "";
  province = "";
  year = null;

  filteredMeets: Meet[];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private leagueService: LeagueService,
    private coordinatorService: CoordinatorsService,
    private registrationService: RegistrationService,
    private meetService: MeetsService,
    private changeDetectorRef: ChangeDetectorRef,
    public platformService: PlatformService
  ) {}

  ngOnInit() {
    for (let i = 2015; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.buildFilterForm();

    this.loader.open();
    this.getData().subscribe((res) => {
      this.loader.close();
      console.log(res);
      this.meetsList = res[1];
      this.filteredMeets = this.meetsList;
      this.meetsReady = true;
      this.changeDetectorRef.detectChanges();
      this.filterMeets();
      this.filterForm.valueChanges.subscribe((res) => {
        this.meetsReady = false;
        this.loader.open();
        this.filterMeets();
      });
    });
  }

  ngOnChanges() {}

  ngOnDestroy() {}

  private getData(): Observable<any> {
    const league = this.leagueService.getLeague();
    const meets = this.meetService.getMeets();
    return forkJoin([league, meets]);
  }

  buildFilterForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      searchString: [""],
      status: [null],
      completed: [null],
      province: [null],
      year: [null],
    });
  }

  filterMeets(): void {
    this.loader.close();
    this.filteredMeets = this.meetService.filterMeets(
      this.meetsList,
      this.filterForm.value
    );
    this.meetsReady = true;
  }
}
