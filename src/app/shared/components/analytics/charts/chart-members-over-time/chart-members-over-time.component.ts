import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Member } from "app/shared/models/member.model";
import { MembersService } from "app/shared/services/members/members.service";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { forkJoin, Observable, Subscription } from "rxjs";

@Component({
  selector: "app-chart-members-over-time",
  templateUrl: "./chart-members-over-time.component.html",
  styleUrls: ["./chart-members-over-time.component.scss"],
})
export class ChartMembersOverTimeComponent implements OnInit {
  private members: any;
  public chartReady = false;
  private filterForm: FormGroup;
  private today = new Date();
  private todayMonth = this.today.getMonth();
  private todayYear = this.today.getFullYear();

  public lineChartData: ChartDataSets[] = [
    { data: [], label: "Count of Members" },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepValue: 1,
            min: 0,
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      borderColor: 'rgba(244, 67, 54, 1)',
      pointBackgroundColor: 'rgba(244, 67, 54, 0.83)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(244, 67, 54, 0.8)'
    },
  ];
  public lineChartLegend = false;
  public lineChartType = "line";
  public lineChartPlugins = [];

  public memberCreationDates: {
    _id: string;
    month: number;
    year: number;
  }[];
  public cumulativeCount: Array<number>;
  public currentYear = new Date().getFullYear();
  public yearsControl = [];
  public years = [];
  public months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  public filteredCounts = [];
  public filteredLabels = [];
  public yearsData: Array<any> = [];
  public yearsCumulativeData: Array<any> = [[]];
  public monthsCumulativeData = [];
  public allData = [];
  public allDataLabels = [];

  constructor(private memberService: MembersService, private fb: FormBuilder) {}

  ngOnInit() {
    for (let i = 2019; i <= this.currentYear; i++) {
      this.yearsControl.push(i.toString());
      this.years.push(i);
    }
    this.years.forEach((year, index) => {
      this.yearsData.push(new Array(12).fill(0));
    });
    this.getData().subscribe((res) => {
      this.members = res[0];
      this.memberCreationDate();
      console.log(this.memberCreationDates);
      this.cumulativeMemberCount();
      this.initForm();
      this.lineChartLabels = this.allDataLabels.slice(0, this.allDataLabels.length - (12 - this.todayMonth));
      this.lineChartData[0].data = this.allData.slice(0, this.allData.length - (12 - this.todayMonth));
      this.initalizeChart("All", 1);
      this.chartReady = true;
    });
  }

  private memberCreationDate() {
    this.memberCreationDates = this.members.map((member) => {
      const memberCreationDate = new Date(member.creationDate);
      return {
        _id: member._id,
        month: memberCreationDate.getMonth(),
        year: memberCreationDate.getFullYear(),
      };
    });
  }

  private cumulativeMemberCount() {
    let total = 0;
    this.memberCreationDates.forEach((member) => {
      const i = this.years.indexOf(member.year);
      this.yearsData[i][member.month] += 1;
    });
    this.yearsCumulativeData = this.yearsData;
    this.yearsData.forEach((year, yearIndex) => {
      this.yearsData[yearIndex].forEach((month, monthIndex) => {
        total += month;
        this.yearsCumulativeData[yearIndex][monthIndex] = total;
      });
      this.monthsCumulativeData.push(this.months);
    });
    this.yearsCumulativeData.forEach((year) => {
      this.allData = this.allData.concat(year);
      this.allDataLabels = this.allDataLabels.concat(this.months);
    });
  }

  private filterData(year, month) {
    let i = this.years.indexOf(year);
    if (year !== this.todayYear) {
      this.filteredCounts = this.yearsCumulativeData[i];
      this.filteredLabels = this.monthsCumulativeData[i];
    } else if (year === this.todayYear) {
      this.filteredCounts = this.yearsCumulativeData[i].slice(0, 13 - (12 - this.todayMonth));
      this.filteredLabels = this.monthsCumulativeData[i].slice(0, 13 - (12 - this.todayMonth));
    }
  }

  private initalizeChart(year, month) {
    console.log(year);
    if (year == "All") {
      this.lineChartData[0].data = this.allData.slice(0, this.allData.length - (11 - this.todayMonth));
      this.lineChartLabels = this.allDataLabels.slice(0, this.allDataLabels.length - (11 - this.todayMonth));
    } else {
      this.filterData(year, month);
      this.lineChartData[0].data = this.filteredCounts;
      this.lineChartLabels = this.filteredLabels;
    }
    this.chartReady = true;
  }

  private initForm() {
    this.filterForm = this.fb.group({
      year: ["All"],
      month: ["All"],
    });
    this.filterForm.valueChanges.subscribe((res) => {
      this.chartReady = false;
      this.initalizeChart(this.filterForm.get("year").value, this.filterForm.get("month").value);
    });
  }

  private getData(): Observable<Member[]> {
    const members = this.memberService.getMembers();
    return forkJoin([members]);
  }
}
