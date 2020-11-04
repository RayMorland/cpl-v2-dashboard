import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { AdminUserService } from 'app/shared/services/admin-user/admin-user.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { UserService } from 'app/shared/services/user/user.service';
import { FileUploader } from 'ng2-file-upload';
import { forkJoin, Observable, of } from 'rxjs';
import Auth from "@aws-amplify/auth";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [egretAnimations]
})
export class SettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  public settingsReady = false;
  private changePasswordForm: FormGroup;
  public passwordChangeReady = true;

  constructor(
    private loader: AppLoaderService,
    private userService: UserService,
    private adminUserService: AdminUserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.loader.open();
    this.getData().subscribe(res => {
      this.initForm();
      this.settingsReady = true;
      this.loader.close();
    });
  }

  private getData(): Observable<any> {
    // const user = this.userService.getUser();
    // return forkJoin([user]);
    return of('foo');
  }

  private initForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
    });
  }

  async updatePassword() {
    this.loader.open();
    this.passwordChangeReady = false;
    try {
      let user = await Auth.currentAuthenticatedUser();
      let result = await Auth.changePassword(
        user,
        this.changePasswordForm.get("oldPassword").value,
        this.changePasswordForm.get("newPassword").value
      );
      console.log(result);
      this.changePasswordForm.get('oldPassword').setValue('');
      this.changePasswordForm.get('newPassword').setValue('');
      this.passwordChangeReady = true;
      if (result === 'SUCCESS') {
        let message = "Password Changed";
        let action = "close";
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
      this.loader.close();
    } catch (err) {
      console.log(err);
    }
  }

}
