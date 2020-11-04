import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MembersService } from 'app/shared/services/members/members.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Member } from 'app/shared/models/member.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  animations: [egretAnimations]
})
export class MembersListComponent implements OnInit {
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;

  public members: Member[] = [];
  public categories$: Observable<any>;
  public activeCategory: string = 'all';
  public filterForm: FormGroup;
  public membersReady = false;
  public formReady = false;
  public filteredMembers: Observable<Member[]>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private membersService: MembersService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader.open();
    this.getData().subscribe(res => {
      this.members = res[0];
      this.initForm();
      this.membersReady = true;
      this.formReady = true;
      this.loader.close();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {

  }

  private getData(): Observable<any> {
    const members = this.membersService.getMembers();
    return forkJoin([members]);
  }

  private initForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      name: ['']
    });

    this.filteredMembers = this.filterForm.get('name').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.personal.firstName),
      map(name => name ? this.filterMembers(name) : this.members.slice())
    );
  }

  private filterMembers(value: string): Member[] {
    const filterValue = value.toLowerCase();
    return this.members.filter((member) =>
      member.personal.firstName.toLowerCase().includes(filterValue)
    );
  }

}
