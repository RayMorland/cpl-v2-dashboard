import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MeetsService } from 'app/shared/services/meets/meets.service';

@Component({
  selector: 'app-meets-overview',
  templateUrl: './meets-overview.component.html',
  styleUrls: ['./meets-overview.component.scss'],
  animations: [egretAnimations]
})
export class MeetsOverviewComponent implements OnInit {
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;

  public meets$: Observable<any>;
  public meetsObs: Observable<any>;
  public meetsInfo: any;
  public meets;
  public upcomingMeets: any;
  public previousMeets: any;
  public meetsReady = false;

  public meetLocationData: Array<any> = [];

  // Tables
  displayedColumns: string[] = ['date', 'title', 'coordinator', 'edit'];
 
  // Charts

  sharedChartOptions: any = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    }
  };

  chartColors: Array <any> = [{
    backgroundColor: '#3f51b5',
    borderColor: '#3f51b5',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#eeeeee',
    borderColor: '#e0e0e0',
    pointBackgroundColor: '#e0e0e0',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }, {
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];

  public coordinatorChartLabels: string[] = [];
  public coordinatorChartData: number[] = [];


  public provinceChartLabels: string[] = [];
  public provinceChartData: number[] = [];

  public pieChartType: string = 'pie';
  public pieChartColors: Array<any> = [{
    backgroundColor: ['rgba(255, 217, 125, 0.8)', 'rgba(36, 123, 160, 0.8)', 'rgba(244, 67, 54, 0.8)']
  }];
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }, this.sharedChartOptions);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private meetService: MeetsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader.open();
    this.getMeets();
  }

  ngOnDestroy() {

  }

  getMeets() {
    this.meetService.getMeets().subscribe(meets => {
      this.meets = meets;
      this.meetsReady = true;
      this.loader.close();
      this.changeDetectorRef.detectChanges();
      this.getMeetsData();
    });
  }

  getMeetsData(): void {

    // const provinces = [
    //   'Alberta',
    //   'British Columbia',
    //   'Manitoba',
    //   'New Brunswick',
    //   'Newfoundland and Labrador',
    //   'Northwest Territories',
    //   'Nova Scotia',
    //   'Nunavut',
    //   'Ontario',
    //   'Prince Edward Island',
    //   'Quebec',
    //   'Saskatchewan',
    //   'Yukon'
    // ];

    let provinceData = [];
    let provinceList = [];
    let provinces = [];

    let coordinatorData = [];
    let coordinatorList = [];
    let coordinators = [];

    // Get upcoming and previous meets
    const todaysTime = new Date();
    this.upcomingMeets = this.meets.filter((meet) => {
      if (meet.dates.length > 0) {
        const meetDate = new Date(meet.dates[0].startTime);
        return meetDate > todaysTime;
      }
    });
    this.previousMeets = this.meets.filter((meet) => {
      if (meet.dates.length > 0) {
        const meetDate = new Date(meet.dates[0].startTime);
        return meetDate <= todaysTime;
      }
    });

    console.log(this.previousMeets);

    // Get meet location data
    this.meets.forEach(meet => {
      provinceList.push(meet.venue.location.address.province);
      coordinatorList.push(meet.coordinator.name);
    });

    provinces = Array.from(new Set(provinceList));

    provinces.forEach((province) => {
      provinceData.push({
        'province': province,
        'numberOfMeets': this.meets.filter(meet => meet.venue.location.address.province === province).length
      });
    });

    this.provinceChartData = [];
    this.provinceChartLabels = [];

    provinceData.forEach(province => {
      this.provinceChartData.push(province.numberOfMeets);
      this.provinceChartLabels.push(province.province);
    });

    // Get coordinator meet data

    coordinators = Array.from(new Set(coordinatorList));

    coordinators.forEach((coordinator) => {
      coordinatorData.push({
        'name': coordinator,
        'numberOfMeets': this.meets.filter(meet => meet.coordinator.name === coordinator).length
      });
    });

    this.coordinatorChartData = [];
    this.coordinatorChartLabels = [];

    coordinatorData.forEach(coordinator => {
      this.coordinatorChartData.push(coordinator.numberOfMeets);
      this.coordinatorChartLabels.push(coordinator.name);
    });
  }

  public pieChartClicked(e: any): void {
  }
  public pieChartHovered(e: any): void {
  }
}
