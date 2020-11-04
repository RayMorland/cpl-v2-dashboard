import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Member } from 'app/shared/models/member.model';
import { map, startWith } from 'rxjs/operators';
import { Membership } from 'app/shared/models/membership.model';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { Coordinator } from 'app/shared/models/coordinator.model';
import { cplAnimations } from 'app/shared/animations/cpl-animations';

@Component({
  selector: 'app-coordinators-list',
  templateUrl: './coordinators-list.component.html',
  styleUrls: ['./coordinators-list.component.scss'],
  animations: [cplAnimations],
})
export class CoordinatorsListComponent implements OnInit, OnDestroy {
  public coordinators: Coordinator[] = [];
  public categories$: Observable<any>;
  public filterForm: FormGroup;
  public coordinatorsReady = false;
  public formReady = false;
  public filteredCoordinators: Observable<Coordinator[]>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private coordinatorsService: CoordinatorsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loader.open();
    this.getData().subscribe((res) => {
      this.coordinators = res[0];
      this.initForm();
      this.coordinatorsReady = true;
      this.formReady = true;
      this.loader.close();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {}

  private getData(): Observable<any> {
    const coordinators = this.coordinatorsService.getCoordinators();
    return forkJoin([coordinators]);
  }

  private initForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      name: [''],
    });

    this.filteredCoordinators = this.filterForm.get('name').valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value.personal.firstName
      ),
      map((name) =>
        name ? this.filterCoordinators(name) : this.coordinators.slice()
      )
    );
  }

  private filterCoordinators(value: string): Coordinator[] {
    const filterValue = value.toLowerCase();
    return this.coordinators.filter((coordinator) =>
      coordinator.name.toLowerCase().includes(filterValue)
    );
  }
}