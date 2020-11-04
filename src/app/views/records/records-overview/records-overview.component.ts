import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Record } from 'app/shared/models/record.model';
import { RecordsService } from 'app/shared/services/records/records.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-records-overview',
  templateUrl: './records-overview.component.html',
  styleUrls: ['./records-overview.component.scss'],
  animations: [egretAnimations]
})
export class RecordsOverviewComponent implements OnInit {
  public records: Record[];
  public recordsReady = false;

  constructor(
    private recordsService: RecordsService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.getrecords();
  }

  getrecords() {
    this.recordsService
      .getRecords()
      .subscribe(records => {
        this.records = records;
        this.loader.close();
        this.recordsReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

}
