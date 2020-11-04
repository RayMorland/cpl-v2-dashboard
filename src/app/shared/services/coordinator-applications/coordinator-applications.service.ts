import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CoordinatorApplication } from 'app/shared/models/coordinator-application.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CoordinatorApplicationsService {

  coordinatorApplication: CoordinatorApplication;

  constructor(
    private http: HttpClient
  ) { }

  public getCoordinatorApplications(): Observable<any> {
    return this.http.get(API_URL + '/getcoordinatorapplications', {});
  }
  public findCoordinatorApplication(coordinatorApplicationId: string): Observable<any> {
    const params = new HttpParams().set('_id', coordinatorApplicationId);
    return this.http.get(API_URL + '/findcoordinatorapplication', { params: params });
  }
  public createCoordinatorApplication(coordinatorApplication: CoordinatorApplication): Observable<any> {
    return this.http.post(API_URL + '/createcoordinatorapplication', { newCoordinatorApplication: coordinatorApplication});
  }
  public updateCoordinatorApplication(id: string, coordinatorApplication: CoordinatorApplication): Observable<any> {
    return this.http.post(API_URL + '/updatecoordinatorapplication', { '_id': id, 'updatedCoordinatorApplication': coordinatorApplication});
  }
  public deleteCoordinatorApplication(coordinatorApplication: CoordinatorApplication): Observable<any> {
    return this.http.post(API_URL + '/deletecoordinatorapplication', { deletedCoordinatorApplication: coordinatorApplication});
  }
}
