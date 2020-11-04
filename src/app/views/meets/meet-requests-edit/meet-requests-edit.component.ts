import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoordinatorsService } from 'app/shared/services/coordinators/coordinators.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-meet-requests-edit',
  templateUrl: './meet-requests-edit.component.html',
  styleUrls: ['./meet-requests-edit.component.scss']
})
export class MeetRequestsEditComponent implements OnInit {
  formData = {};
  formReady = false;
  editMode = false;
  console = console;
  coordinator: any;
  coordinatorObs: Observable<any>;
  coordinatorId: string;

  generalInfoGroup: FormGroup;

  editorData = `<h1>Egret | Angular material admin</h1>
  <p><a href="http://devegret.com" target="_blank"><strong>DevEgret</strong></a></p>
  <p><br></p><p><strong >Lorem Ipsum</strong>
  <span>&nbsp;is simply dummy text of the printing and typesetting industry. 
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</span></p>`;

  constructor(
    private fb: FormBuilder,
    private coordinatorService: CoordinatorsService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {

    this.loader.open();

    this.initForm();

    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.coordinatorId = params.id;
          this.coordinatorObs = this.coordinatorService.findCoordinator(this.coordinatorId);
          this.coordinatorService.findCoordinator(this.coordinatorId).subscribe(
            (res) => {
              this.loader.close();
              this.editMode = true;
              this.coordinator = res;
              console.log(this.coordinator);
              this.setFormValues();
            });
        } else {
          this.initForm();
        }
      }
    );
  }

  private setFormValues() {

    if (this.coordinator.hasOwnProperty('name')) {
      this.generalInfoGroup.setValue({
        name: this.coordinator.name
      });
    }
  }

  private initForm(): void {

    this.loader.close();
    this.formReady = true;

    this.generalInfoGroup = this.fb.group({
      name: ['', Validators.required],
      // description: [description, Validators.required],
      // imagePath: [imagePath, Validators.required],
      // coordinatorReleaseDate: [coordinatorReleaseDate, Validators.required],
      // publicReleaseDate: [publicReleaseDate, Validators.required],
    });
  }
}
