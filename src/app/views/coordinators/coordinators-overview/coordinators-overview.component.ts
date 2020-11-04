import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
@Component({
  selector: 'app-coordinators-overview',
  templateUrl: './coordinators-overview.component.html',
  styleUrls: ['./coordinators-overview.component.scss'],
  animations: [egretAnimations]
})
export class CoordinatorsOverviewComponent implements OnInit {
  tickets: any;
  lineChartSteppedData: Array <any> = [{
    data: [1, 8, 4, 8, 2, 2, 9],
    label: 'Order',
    borderWidth: 0,
    fill: true,
    // steppedLine: true
  }, {
    data: [6, 2, 9, 3, 8, 2, 1],
    label: 'New client',
    borderWidth: 1,
    fill: true,
    // steppedLine: true
  }];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];
  /*
  * Full width Chart Options
  */
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        display: false,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        display: false,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 9,
        }
      }]
    }
  };

  public lineChartColors: Array<any> = [{
    backgroundColor: 'rgba(3, 169, 244, 0.5)',
    borderColor: 'rgba(0,0,0,0)',
    pointBackgroundColor: 'rgba(3, 169, 244, 0.4)',
    pointBorderColor: 'rgba(0, 0, 0, 0)',
    pointHoverBackgroundColor: 'rgba(3, 169, 244, 1)',
    pointHoverBorderColor: 'rgba(148,159,177,0)'
  }, {
    backgroundColor: 'rgba(0, 0, 0, .08)',
    borderColor: 'rgba(0,0,0,0)',
    pointBackgroundColor: 'rgba(0, 0, 0, 0.06)',
    pointBorderColor: 'rgba(0, 0, 0, 0)',
    pointHoverBackgroundColor: 'rgba(0, 0, 0, 0.1)',
    pointHoverBorderColor: 'rgba(0, 0, 0, 0)'
  }];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;

  public coordinators$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private coordinatorService: CoordinatorsService
  ) { }

  ngOnInit() {
    this.getCoordinators();
  }

  ngOnDestroy() {

  }
  getCoordinators() {
    this.coordinatorService
      .getCoordinators()
      .subscribe(coordinators => {
        this.coordinators$ = coordinators;
        console.log(coordinators);
      });
  }
}
