import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Membership } from 'app/shared/models/membership.model';
import { MembershipsService } from 'app/shared/services/memberships/memberships.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { forkJoin, Observable } from 'rxjs';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.scss'],
  animations: [egretAnimations]
})
export class MembershipDetailsComponent implements OnInit {
  membership: Membership;
  membershipReady = false;
  membershipId: string;
  private membershipPlans: any[] = [];

  constructor(
    private membershipService: MembershipsService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    this.loader.open();

    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.membershipId = params.id;
        this.getData().subscribe((res) => {
          console.log(res);
          this.membership = res[0];
          this.membershipPlans = res[1];
          this.loader.close();
          this.membershipReady = true;
          this.changeDetectorRef.detectChanges();
        });
      } else {
      }
    });
  }

  private getData(): Observable<any> {
    const membership = this.membershipService.findMembership(this.membershipId);
    const plans = this.membershipService.membershipPlans(this.membershipId);
    return forkJoin([membership, plans]);
  }
}
