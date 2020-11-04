import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MeetRequest } from 'app/shared/models/meet-request.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MeetRequestsService {

  meetRequests: MeetRequest;

  constructor(
    private http: HttpClient
  ) { }

  public getMeetRequests(): Observable<any> {
    return this.http.get(API_URL + '/getmeetrequests', {});
  }
  public findMeetRequest(meetRequestId: string): Observable<any> {
    const params = new HttpParams().set('_id', meetRequestId);
    return this.http.get(API_URL + '/findmeetrequest', { params: params });
  }
  public createMeetRequest(meetRequest: MeetRequest): Observable<any> {
    return this.http.post(API_URL + '/createmeetrequest', { newMeetRequest: meetRequest});
  }
  public updateMeetRequest(id: string, meetRequest: MeetRequest): Observable<any> {
    return this.http.post(API_URL + '/updatemeetrequest', { '_id': id, 'updatedMeetRequest': meetRequest});
  }
  public deleteMeetRequest(meetRequest: MeetRequest): Observable<any> {
    return this.http.post(API_URL + '/deletemeetrequest', { deletedMeetRequest: meetRequest});
  }
}
