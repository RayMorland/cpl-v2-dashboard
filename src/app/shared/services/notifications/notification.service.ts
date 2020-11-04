import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllNotifications(): Observable<any> {
    return this.http.get(API_URL + '/listallnotifications', {});
  }

  public getAdminNotifications(): Observable<any> {
    return this.http.get(API_URL + '/getadminnotifications', {});
  }

  public getUserNotifications(userId: string): Observable<any> {
    return this.http.get(API_URL + '/getusernotifications', { params: { _id: userId } } );
  }

  public getMembersNotifications(memberId: string): Observable<any> {
    return this.http.get(API_URL + '/retrievenotifications', { params: { _id: memberId }});
  }
}
