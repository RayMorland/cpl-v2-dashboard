import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { MediaService } from "app/shared/services/media/media.service";
import { Media } from "app/shared/models/media.model";
import { MatSnackBar, MatDialog } from "@angular/material";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { FormBuilder } from "@angular/forms";
import { GalleryItemPopupComponent } from "./gallery-item-popup/gallery-item-popup.component";
import { cplAnimations } from "app/shared/animations/cpl-animations";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
  animations: [cplAnimations]
})
export class GalleryComponent implements OnInit, OnChanges {
  media: Media[];
  mediaReady = false;
  updatedMedia: Media[];

  constructor(
    private mediaService: MediaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loader.open();
    this.getMedia();
    this.mediaService.getMediaUpdated().subscribe(value => {
      console.log(value);
      this.addMedia(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getMedia() {
    this.mediaService.getAllMedia().subscribe(media => {
      this.media = media;
      console.log(this.media);
      this.loader.close();
      this.mediaReady = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  addMedia(id) {
    // this.updatedMedia = media;
    console.log(id);
    if (id.length ) {
      this.mediaService.findMedia(id).subscribe(res => {
        console.log(res);
        this.media.push(res);
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GalleryItemPopupComponent, {
      width: "60vw",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getMedia();
    });
  }
}
