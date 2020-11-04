import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MembershipsService } from 'app/shared/services/memberships/memberships.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, forkJoin } from 'rxjs';
import { Membership } from 'app/shared/models/membership.model';
import { Plan } from 'app/shared/models/plan.model';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-membership-edit',
  templateUrl: './membership-edit.component.html',
  styleUrls: ['./membership-edit.component.scss'],
  animations: [egretAnimations]
})
export class MembershipEditComponent implements OnInit {
  formReady = false;
  editMode = false;
  membership: Membership;
  membershipId: string;
  membershipReady = false;
  membershipPlans: Plan[] = [];

  membershipForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipsService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader.open();
    this.initForm();

    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.membershipId = params.id;
          this.editMode = true;
          this.getData().subscribe(res => {
            this.membership = new Membership(res[0]);
            console.log(this.membership);
            this.setFormValues();
            this.loader.close();
            this.membershipReady = true;
            this.changeDetectorRef.detectChanges();
          });
        } else {
          this.editMode = false;
          this.membership = new Membership();
          this.setFormValues();
          this.loader.close();
          this.membershipReady = true;
        }
      }
    );
  }

  private getData(): Observable<any> {
    if (this.editMode) {
      const membership = this.membershipService.findMembership(this.membershipId);
      return forkJoin([membership]);
    }
  }

  private initForm() {
    // this.formReady = true;

    this.membershipForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // At least one plan required
      plans: this.fb.array([], [Validators.required])
    });

    this.onFormChanges();
  }

  private onFormChanges() {
    this.membershipForm.valueChanges.subscribe(res =>{
      console.log(res);
    });
  }

  private setFormValues() {

  }

  private addPlanToMembership(): void {
    this.plansArray.push(
      this.fb.group({
        name: [null, Validators.required],
        status: [false, Validators.required],
        amount: [null, Validators.required],
        // [day, week, month, year]
        interval: [null, Validators.required],
        // min/max validator based on interval selected
        intervalCount: [null, Validators.required]
      })
    );
  }

  public removePlanFromMembership(index): void {
    // if (this.plansArray.length > 1) {
      this.plansArray.removeAt(index);
    // }
  }

  public submitForm(): void {
    this.membership.name = this.nameControl.value;
    this.membership.description = this.descriptionControl.value;
    const plans: Plan[] = [];
    this.plansArray.controls.forEach(control => {
      const newPlan = new Plan({
        name: control.value.name,
        amount: control.value.amount,
        interval: control.value.interval,
        intervalCount: control.value.intervalCount
      });
      this.membershipPlans.push(newPlan);
    });

    if (this.editMode) {
      this.membershipService.updateMembership(this.membershipId, this.membership).subscribe((res) => {
        this.router.navigate(['/memberships/' + res._id]);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.membershipService.createMembership(this.membership, this.membershipPlans).subscribe((res) => {
        this.router.navigate(['/memberships/' + res._id]);
      }, (err) => {
        console.log(err);
      });
    }
  }

  private get plansArray() {
    return this.membershipForm.get('plans') as FormArray;
  }

  private get nameControl() {
    return this.membershipForm.get('name');
  }

  private get descriptionControl() {
    return this.membershipForm.get('description');
  }
}
