import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MembershipsService } from 'app/shared/services/memberships/memberships.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Membership } from 'app/shared/models/membership.model';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Observable } from 'rxjs';
import { MembersService } from 'app/shared/services/members/members.service';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-memberships-overview',
  templateUrl: './memberships-overview.component.html',
  styleUrls: ['./memberships-overview.component.scss'],
  animations: [egretAnimations]
})
export class MembershipsOverviewComponent implements OnInit {
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

  public meets$: Observable<any>;

  public memberships: Membership[];
  public membershipsReady = false;

  constructor(
    private membershipService: MembershipsService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private memberService: MembersService

  ) { }

  ngOnInit() {
    this.getMemberships();
  }

  getMemberships() {
    this.membershipService
      .getMemberships()
      .subscribe(memberships => {
        this.memberships = memberships;
        this.loader.close();
        this.membershipsReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

}
