import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeetsService } from 'app/shared/services/meets/meets.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable } from 'rxjs';
import { RegistrationService } from 'app/shared/services/registrations/registration.service';
import { MembersService } from 'app/shared/services/members/members.service';
import { Member } from 'app/shared/models/member.model';
import { Meet } from 'app/shared/models/meet.model';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Registration } from 'app/shared/models/registration.model';

@Component({
  selector: 'app-meet-registrants-edit',
  templateUrl: './meet-registrants-edit.component.html',
  styleUrls: ['./meet-registrants-edit.component.scss']
})
export class MeetRegistrantsEditComponent implements OnInit {
  formData = {};
  formReady = false;
  editMode = false;
  console = console;
  registration: any;
  registrationId: string;
  meet: Meet;
  meetId: string;
  members: any;
  public meetReady = false;

  registrationForm: FormGroup;

  editorData = `<h1>Egret | Angular material admin</h1>
  <p><a href="http://devegret.com" target="_blank"><strong>DevEgret</strong></a></p>
  <p><br></p><p><strong >Lorem Ipsum</strong>
  <span>&nbsp;is simply dummy text of the printing and typesetting industry. 
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</span></p>`;

  constructor(
    private fb: FormBuilder,
    private meetService: MeetsService,
    private memberService: MembersService,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.loader.open();

    // let info = this.getInfo();
    // info.then(res => {

    // });
    this.getInfo();
    console.log("After");
    // this.getMeet();
  }

  async getInfo() {
    let paramsId = await this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (params.hasOwnProperty('id') && !params.hasOwnProperty('id2')) {
        this.editMode = false;
        this.meetId = params.id;
      } else if (params.hasOwnProperty('id') && params.hasOwnProperty('id2')) {
        this.editMode = true;
        this.meetId = params.id;
        this.registrationId = params.id2;
      }
    });
    let meetSub = await this.meetService.findMeet(this.meetId).subscribe(
      (res) => {
        this.meet = res[0];
        console.log(this.meet);
      });
    let memberSub = await this.memberService.getMembers().subscribe((res) => {
      console.log(res);
      this.members = res;
    });

    this.meetReady = true;
    this.initForm();
    this.changeDetectorRef.detectChanges();

    if (this.editMode) {
      let registrationSub = await this.registrationService.findRegistration(this.registrationId).subscribe((res) => {
        this.registration = new Registration(res[0]);
        console.log(this.registration);
        this.setFormValues();
      });
    }
    this.loader.close();
  }

  // figure out how to make this function the promise to be resolved in getInfo()
  async getMeet(id: string): Promise<any> {
    
  }

  private submitForm(): void {
    let newRegistration = new Registration(this.registrationForm.value);
    newRegistration.meetId = this.meetId;
    newRegistration._id = this.registrationId;
    console.log(newRegistration);

    if (this.editMode) {
      this.registrationService.updateRegistration(this.registrationId, newRegistration).subscribe((res) => {
        this.router.navigate(['/meets/' + this.meetId + '/registrants']);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.registrationService.createRegistration(newRegistration).subscribe((res) => {
        console.log(res);
        this.router.navigate(['/meets/' + this.meetId + '/registrants']);
      }, (err) => {
        console.log(err);
      });
    }
  }

  private setFormValues(): void {
    this.registrationForm.setValue({
      name: this.registration.name,
      meetId: this.registration.meetId,
    });
  }

  private initForm(): void {

    this.loader.close();
    this.formReady = true;

    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      meetId: [this.meetId, Validators.required]
      // description: [description, Validators.required],
      // imagePath: [imagePath, Validators.required],
      // meetReleaseDate: [meetReleaseDate, Validators.required],
      // publicReleaseDate: [publicReleaseDate, Validators.required],
    });
  }
}
