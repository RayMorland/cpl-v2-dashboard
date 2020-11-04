import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Media } from 'app/shared/models/media.model';
import { MediaService } from 'app/shared/services/media/media.service';
import { MeetsService } from 'app/shared/services/meets/meets.service';

@Component({
  selector: 'app-meet-results-popup',
  templateUrl: './meet-results-popup.component.html',
  styleUrls: ['./meet-results-popup.component.scss']
})
export class MeetResultsPopupComponent implements OnInit {
  public resultsForm: FormGroup;
  private meetId: string;
  public resultsReady = false;

  public uploader: FileUploader = new FileUploader({
    url: "http://localhost:3000/api/uploadmeetresults"
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetResultsPopupComponent>,
    private fb: FormBuilder,
    public mediaService: MediaService,
    private meetService: MeetsService
  ) { }

  ngOnInit() {
    this.meetId = this.data.meet._id;
    console.log(this.meetId);
    this.resultsReady = true;
    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) =>
      this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItem(item, response, status, headers);
  }

  upload() {
    this.resultsReady = false;
    this.uploader.queue[0].upload();
  }

  buildItemForm(item) {
    this.resultsForm = this.fb.group({
      name: [item.name || '', Validators.required],
      age: [item.age || ''],
      email: [item.email || ''],
      company: [item.company || ''],
      phone: [item.phone || ''],
      address: [item.address || ''],
      balance: [item.balance || ''],
      isActive: [item.isActive || false]
    });
  }

  onSuccessItem(
    item: FileItem,
    response: any,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    let resJson: any = JSON.parse(response);
    this.meetService.updateMeetResultsLink(this.meetId, resJson.location).subscribe(res => {
      this.meetService.createResultsFromSpreadsheet(this.meetId, resJson).subscribe(res => {
        console.log(res);
        this.resultsReady = true;
        this.dialogRef.close(res);
      });
    }, err => {
      console.log(err);
    });
  }

  onErrorItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    console.log(response); //error server response
  }

  submit() {
    this.dialogRef.close(this.resultsForm.value)
  }
}
