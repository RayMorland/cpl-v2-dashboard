import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable } from 'rxjs';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-meet-results',
  templateUrl: './meet-results.component.html',
  styleUrls: ['./meet-results.component.scss'],
  animations: [egretAnimations]
})
export class MeetResultsComponent implements OnInit {
  meetId: string;
  resultsObs: Observable<any>;
  meetInfo: any;
  meetResults: any[];
  meetReady = false;

  constructor(
    private meetService: MeetsService,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.meetId = params.id;
          this.meetService.getMeetResults(this.meetId).subscribe(
            (res) => {
              console.log(res);
              if (res.message = "No results found") {
                this.meetResults = [];
              } else {
                this.meetResults = res;
              }
              this.loader.close();
              this.meetReady = true;
              this.changeDetectorRef.detectChanges();
            });
        } else {
        }
      }
    );
  }

  private getRegistrants(): void {
    
  }

}
