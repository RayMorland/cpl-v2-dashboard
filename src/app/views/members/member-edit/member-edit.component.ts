import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MembersService } from "app/shared/services/members/members.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { Observable, forkJoin } from "rxjs";
import { egretAnimations } from "app/shared/animations/egret-animations";
import { Member } from "app/shared/models/member.model";
import { dateOfBirthValidator } from "app/shared/helpers/validators";
import { DatePipe } from "@angular/common";
import { MembershipsService } from "app/shared/services/memberships/memberships.service";
import { Membership } from "app/shared/models/membership.model";
import { LeagueService } from "app/shared/services/league/league.service";
import { PlatformService } from "app/shared/services/platform/platform.service";
import { League } from "app/shared/models/league.model";
import { Plan } from "app/shared/models/plan.model";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.scss"],
  animations: [egretAnimations],
})
export class MemberEditComponent implements OnInit {
  public formReady = false;
  public editMode = false;
  private member: Member;
  private memberId: string;
  public memberReady = false;
  private memberForm: FormGroup;
  private dp = new DatePipe(navigator.language);
  private p = "yyyy-MM-dd";
  private cplMemberships: Membership[];
  private league: League;
  private membershipPlans = [];

  constructor(
    private fb: FormBuilder,
    private memberService: MembersService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private membershipService: MembershipsService,
    private platformService: PlatformService,
    private leagueService: LeagueService
  ) {}

  ngOnInit() {
    this.loader.open();
    this.initForm();
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty("id")) {
        this.editMode = true;
        this.memberId = params.id;
        this.getData().subscribe((res) => {
          this.loader.close();
          this.member = new Member(res[0]);
          console.log(res);
          this.cplMemberships = res[1];
          this.setFormValues();
          if (this.member.membership.membershipId) {
            this.membershipService.membershipPlans(this.member.membership.membershipId._id)
            .subscribe((res: Plan[]) => {
              console.log(res);
              res.forEach((plan) => this.membershipPlans.push(plan));
              this.membershipPlanControl.setValue(res[0]._id);
              this.membershipPlanControl.enable();
              this.league = new League();
              this.memberReady = true;
              this.formReady = true;
              this.changeDetectorRef.detectChanges();
            });
          } else {
            this.league = new League();
            this.setFormValues();
            this.memberReady = true;
            this.formReady = true;
            this.changeDetectorRef.detectChanges();
          }
        });
      } else {
        this.getData().subscribe((res) => {
          this.loader.close();
          this.member = new Member();
          this.league = new League();
          this.cplMemberships = res[0];
          console.log(this.cplMemberships);
          this.membershipPlanControl.disable();
          if (!this.editMode) {
            this.cplMembershipControl.valueChanges.subscribe((res) => {
              this.onFormChanges(res);
            });
          }
          this.editMode = false;
          this.formReady = true;
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }

  private getData(): Observable<any> {
    if (this.editMode) {
      const member = this.memberService.findMember({ _id: this.memberId });
      const memberships = this.membershipService.getMemberships();
      // const league = this.leagueService.getLeague();
      return forkJoin([member, memberships]);
    } else {
      const memberships = this.membershipService.getMemberships();
      // const league = this.leagueService.getLeague();
      return forkJoin([memberships]);
    }
  }

  private initForm() {
    this.memberForm = this.fb.group({
      personal: this.fb.group({
        email: ["", Validators.required],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        dob: [null, [Validators.required, dateOfBirthValidator]],
        gender: ["", [Validators.required]],
        phone: [""],
        homeGym: [""],
        coach: [""],
        address: this.fb.group({
          street: ["", [Validators.required]],
          city: ["", [Validators.required]],
          province: ["", [Validators.required]],
          postal: ["", [Validators.required]],
          country: ["", [Validators.required]],
        }),
      }),
      membership: this.fb.group({
        cplMembership: [null, Validators.required],
        membershipPlan: [null],
        membershipActive: [false],
        feePaid: [false],
        // Enter manually if member already member to cpl. required if membership active set to true
        startDate: [null],
        endDate: [null],
      }),
    });
  }

  private setFormValues() {
    this.emailControl.setValue(this.member.email);
    this.firstNameControl.setValue(this.member.personal.firstName);
    this.lastNameControl.setValue(this.member.personal.lastName);
    this.dateOfBirthControl.setValue(
      this.dp.transform(this.member.personal.dob, this.p)
    );
    this.genderControl.setValue(this.member.personal.gender);
    this.phoneControl.setValue(this.member.personal.phone);
    this.homeGymControl.setValue(this.member.personal.homeGym);
    this.coachControl.setValue(this.member.personal.coach);
    this.streetControl.setValue(this.member.personal.address.street);
    this.cityControl.setValue(this.member.personal.address.city);
    this.provinceControl.setValue(this.member.personal.address.province);
    this.countryControl.setValue(this.member.personal.address.country);
    this.postalControl.setValue(this.member.personal.address.postal);
    this.membershipStartDateControl.setValue(this.dp.transform(this.member.membership.startDate, this.p));
    this.membershipEndDateControl.setValue(this.dp.transform(this.member.membership.endDate, this.p));
    if (this.member.membership.membershipId) {
      this.cplMembershipControl.setValue(this.member.membership.membershipId._id);
    }
    if (this.member.membership.status === "active") {
      this.membershipActiveControl.setValue(true);
    } else {
      this.membershipActiveControl.setValue(false);
    }
    this.membershipFeePaidControl.setValue(this.member.membership.feePaid);
    this.cplMembershipControl.valueChanges.subscribe((res) => {
      this.onFormChanges(res);
    });
  }

  private onFormChanges(formValue) {
    this.membershipPlans = [];
    if (this.cplMembershipControl.valid) {
      let i;
      i = this.cplMemberships.findIndex(membership => membership._id === this.cplMembershipControl.value);
      this.membershipService
        .membershipPlans(this.cplMemberships[i]._id)
        .subscribe((res: Plan[]) => {
          res.forEach((plan) => this.membershipPlans.push(plan));
          this.membershipPlanControl.enable();
        });
    } else {

    }
  }

  public submitForm(): void {
    console.log(this.memberForm.value);
    this.member.status = "active";
    this.member.email = this.emailControl.value;
    this.member.personal.firstName = this.firstNameControl.value;
    this.member.personal.lastName = this.lastNameControl.value;
    this.member.personal.gender = this.genderControl.value;
    this.member.personal.dob = this.dateOfBirthControl.value;
    this.member.personal.homeGym = this.homeGymControl.value;
    this.member.personal.coach = this.coachControl.value;
    this.member.personal.address = this.addressGroup.value;
    this.member.membership.membershipId = this.cplMembershipControl.value;
    this.member.membership.planId = this.membershipPlanControl.value;
    this.member.membership.startDate = this.membershipStartDateControl.value;
    this.member.membership.endDate = this.membershipEndDateControl.value;
    if (this.membershipActiveControl.value) {
      this.member.membership.status = "active";
    } else {
      this.member.membership.status = "inactive";
    }
    this.member.membership.feePaid = this.membershipFeePaidControl.value;

    console.log(this.member);
    this.loader.open();
    if (this.editMode) {
      this.memberService.updateMember(this.member._id, this.member).subscribe(
        (res) => {
          this.router.navigate(["/members/" + res._id]);
        },
        (err) => {
          this.loader.close();
          console.log(err);
        },
        () => {}
      );
    } else {
      this.memberService.adminCreateMember(this.member).subscribe(
        (res) => {
          this.loader.close();
          this.router.navigate(["/members/" + res[0]._id]);
        },
        (err) => {
          this.loader.close();
          console.log(err);
        }
      );
    }
  }

  private get emailControl() {
    return this.memberForm.get("personal.email");
  }

  private get firstNameControl() {
    return this.memberForm.get("personal.firstName");
  }

  private get lastNameControl() {
    return this.memberForm.get("personal.lastName");
  }

  private get dateOfBirthControl() {
    return this.memberForm.get("personal.dob");
  }

  private get genderControl() {
    return this.memberForm.get("personal.gender");
  }

  private get phoneControl() {
    return this.memberForm.get("personal.phone");
  }

  private get homeGymControl() {
    return this.memberForm.get("personal.homeGym");
  }

  private get coachControl() {
    return this.memberForm.get("personal.coach");
  }

  private get addressGroup() {
    return this.memberForm.get("personal.address") as FormGroup;
  }

  private get streetControl() {
    return this.memberForm.get("personal.address.street");
  }

  private get cityControl() {
    return this.memberForm.get("personal.address.city");
  }

  private get provinceControl() {
    return this.memberForm.get("personal.address.province");
  }

  private get countryControl() {
    return this.memberForm.get("personal.address.country");
  }

  private get postalControl() {
    return this.memberForm.get("personal.address.postal");
  }

  private get cplMembershipControl() {
    return this.memberForm.get("membership.cplMembership");
  }

  private get membershipActiveControl() {
    return this.memberForm.get("membership.membershipActive");
  }

  private get membershipPlanControl() {
    return this.memberForm.get("membership.membershipPlan");
  }

  private get membershipStartDateControl() {
    return this.memberForm.get("membership.startDate");
  }

  private get membershipEndDateControl() {
    return this.memberForm.get("membership.endDate");
  }

  private get membershipFeePaidControl() {
    return this.memberForm.get("membership.feePaid");
  }
}
