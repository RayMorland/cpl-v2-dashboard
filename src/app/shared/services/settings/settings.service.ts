import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Settings } from 'app/shared/models/settings.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: Settings;

  constructor(
    private http: HttpClient
  ) { }

  public getSettings(): Observable<any> {
    return this.http.get(API_URL + '/getsettings', {});
  }

  public updateSettings(id: string, settings: Settings): Observable<any> {
    return this.http.post(API_URL + '/updatesettings', { '_id': id, 'updatedsettings': settings});
  }
}
