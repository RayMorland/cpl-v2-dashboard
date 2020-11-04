import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Coordinator } from 'app/shared/models/coordinator.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CoordinatorsService {

  coordinator: Coordinator;

  constructor(
    private http: HttpClient
  ) { }

  public getCoordinators(): Observable<any> {
    return this.http.get(API_URL + '/getcoordinators', {});
  }
  public findCoordinator(coordinatorId: string): Observable<any> {
    const params = new HttpParams().set('_id', coordinatorId);
    return this.http.get(API_URL + '/findcoordinator', { params: params });
  }
  public createCoordinator(coordinator: Coordinator): Observable<any> {
    return this.http.post(API_URL + '/createcoordinator', { newCoordinator: coordinator});
  }
  public adminCreateCoordinator(coordinator: Coordinator): Observable<any> {
    return this.http.post(API_URL + '/admincreatecoordinator', { newCoordinator: coordinator});
  }
  public updateCoordinator(id: string, coordinator: Coordinator): Observable<any> {
    return this.http.post(API_URL + '/updatecoordinator', { '_id': id, 'updatedCoordinator': coordinator});
  }
  public deleteCoordinator(coordinator: Coordinator): Observable<any> {
    return this.http.post(API_URL + '/deletecoordinator', { deletedCoordinator: coordinator});
  }
}