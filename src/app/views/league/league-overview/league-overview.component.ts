import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MembersService } from 'app/shared/services/members/members.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar, MatSidenav, MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { League } from 'app/shared/models/league.model';
import { LeagueService } from 'app/shared/services/league/league.service';
import { LeagueEditPopupComponent } from './league-edit-popup/league-edit-popup.component';

@Component({
  selector: 'app-league-overview',
  templateUrl: './league-overview.component.html',
  styleUrls: ['./league-overview.component.scss'],
  animations: [egretAnimations]
})
export class LeagueOverviewComponent implements OnInit {

  public league: League;
  public leagueReady = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private leagueService: LeagueService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loader.open();
    this.getData().subscribe(res => {
      this.league = new League(res[0][0]);
      console.log(this.league);
      this.leagueReady = true;
      this.changeDetectorRef.detectChanges();
      this.loader.close();
    });
  }

  ngOnDestroy() {

  }
  
  private getData(): Observable<any> {
    const league = this.leagueService.getLeague();
    return forkJoin([league]);
  }


  public openLeagueEditPopup(title: string) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      LeagueEditPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, league: this.league },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
      console.log(result);
      this.loader.open();
      this.getData().subscribe(res => {
        this.loader.close();
        this.league = new League(res[0][0]);
        console.log(this.league);
        this.changeDetectorRef.detectChanges();
      }, err => {
        console.log(err);
      });
    });
  }
}
