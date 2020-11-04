import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { MediaService } from "app/shared/services/media/media.service";
import { Media } from "app/shared/models/media.model";

@Component({
  selector: "app-gallery-item-popup",
  templateUrl: "./gallery-item-popup.component.html",
  styleUrls: ["./gallery-item-popup.component.scss"]
})
export class GalleryItemPopupComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: "http://localhost:3000/api/uploadmediaitem"
  });
  public hasBaseDropZoneOver: boolean = false;
  console = console;

  constructor(
    public dialogRef: MatDialogRef<GalleryItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mediaService: MediaService
  ) {}

  ngOnInit() {
    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) =>
      this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItem(item, response, status, headers);
  }

  onSuccessItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    let resJson: Media = JSON.parse(response);
    this.mediaService.setMediaUpdated(resJson._id);
  }

  onErrorItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    this.console.log(response); //error server response
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
