import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { NotificationService } from 'app/shared/services/notifications/notification.service';
import { Notification } from 'app/shared/models/notification.model';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { MembersService } from 'app/shared/services/members/members.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Meet } from 'app/shared/models/meet.model';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { AuthenticationService } from 'app/shared/services/auth/authentication.service';
import { cplAnimations } from 'app/shared/animations/cpl-animations';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss'],
  animations: cplAnimations
})
export class DefaultDashboardComponent implements OnInit {
  public currentPage: any;

  private dataSub: Subscription;
  private notifySub: Subscription;

  public notifications: Notification[];
  public overviewReady = false;
  public upcomingMeets: Meet[] = [];
  public pastMeets: Meet[] = [];
  public coordinator: Coordinator;

  constructor(
    private notificationService: NotificationService,
    private meetsService: MeetsService,
    private coordinatorService: CoordinatorsService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthenticationService
  ) { }
  ngOnInit() {
    this.getData().subscribe( res => {
      if (res[0].length > 0) {
        this.upcomingMeets = this.meetsService.getUpcomingMeets(res[0]).slice(0, 3);
        this.pastMeets = this.meetsService.getPastMeets(res[0]).slice(0, 3);
      }
      this.notificationService.getAdminNotifications().subscribe(res => {
        this.notifications = res.sort((a, b) => {
          const d = new Date(b.creationDate);
          const e = new Date(a.creationDate);
          return d.getTime() - e.getTime();
        });
        this.overviewReady = true;
        this.changeDetectorRef.detectChanges();
      });
    }, err => {
      console.log(err);
    });
  }

  private getData(): Observable<any> {
    const meets = this.meetsService.getMeets();
    return forkJoin([meets]);
  }

  public updateTimeline(): void {
    this.notifySub = this.notificationService.getAdminNotifications().subscribe(res => {
      this.notifications = res;
      this.notifySub.unsubscribe();
    }, err => {
      console.log(err);
    });
  }

}
