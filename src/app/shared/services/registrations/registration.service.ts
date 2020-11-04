import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Registration } from 'app/shared/models/registration.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  registration: Registration;

  constructor(
    private http: HttpClient
  ) { }

  public getRegistrations(): Observable<any> {
    return this.http.get(API_URL + '/getRegistrations', {});
  }
  public findRegistration(registrationId: string): Observable<any> {
    const params = new HttpParams().set('_id', registrationId);
    return this.http.get(API_URL + '/findRegistration', { params: params });
  }
  public adminCreateRegistration(registration: Registration): Observable<any> {
    return this.http.post(API_URL + '/admincreateregistration', { newRegistration: registration});
  }
  public createRegistration(registration: Registration): Observable<any> {
    console.log(registration);
    return this.http.post(API_URL + '/createRegistration', { newRegistration: registration});
  }
  public updateRegistration(id: string, registration: Registration): Observable<any> {
    return this.http.post(API_URL + '/updateRegistration', {'_id': id, 'updatedRegistration': registration});
  }
  public deleteRegistration(id: string): Observable<any> {
    return this.http.post(API_URL + '/deleteRegistration', { deletedRegistration: id});
  }

  public createRegistrationSpreadsheet(id: string): Observable<any> {
    return this.http.post(API_URL + '/createregistrationsspreadsheet', { meetId: id });
  }
}
