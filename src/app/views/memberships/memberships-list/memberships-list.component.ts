import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MembershipsService } from 'app/shared/services/memberships/memberships.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Member } from 'app/shared/models/member.model';
import { map, startWith } from 'rxjs/operators';
import { Membership } from 'app/shared/models/membership.model';

@Component({
  selector: 'app-memberships-list',
  templateUrl: './memberships-list.component.html',
  styleUrls: ['./memberships-list.component.scss'],
  animations: [egretAnimations],
})
export class MembershipsListComponent implements OnInit, OnDestroy {
  public memberships: Membership[] = [];
  public categories$: Observable<any>;
  public filterForm: FormGroup;
  public membershipsReady = false;
  public formReady = false;
  public filteredMemberships: Observable<Membership[]>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private membershipsService: MembershipsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loader.open();
    this.getData().subscribe((res) => {
      this.memberships = res[0];
      this.initForm();
      this.membershipsReady = true;
      this.formReady = true;
      this.loader.close();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {}

  private getData(): Observable<any> {
    const memberships = this.membershipsService.getMemberships();
    return forkJoin([memberships]);
  }

  private initForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      name: [''],
    });

    this.filteredMemberships = this.filterForm.get('name').valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value.personal.firstName
      ),
      map((name) =>
        name ? this.filterMemberships(name) : this.memberships.slice()
      )
    );
  }

  private filterMemberships(value: string): Membership[] {
    const filterValue = value.toLowerCase();
    return this.memberships.filter((membership) =>
      membership.name.toLowerCase().includes(filterValue)
    );
  }
}
