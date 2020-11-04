import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Membership } from 'app/shared/models/membership.model';
import { Plan } from 'app/shared/models/plan.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {

  membership: Membership;

  constructor(
    private http: HttpClient
  ) { }

  public getMemberships(): Observable<any> {
    return this.http.get(API_URL + '/getmemberships', {});
  }
  public findMembership(membershipId: string): Observable<any> {
    const params = new HttpParams().set('_id', membershipId);
    return this.http.get(API_URL + '/findmembership', { params: params });
  }
  public createMembership(membership: Membership, plans: Plan[]): Observable<any> {
    return this.http.post(API_URL + '/createmembership', { newMembership: membership, membershipPlans: plans});
  }
  public updateMembership(id: string, membership: Membership): Observable<any> {
    return this.http.post(API_URL + '/updatemembership', { '_id': id, 'updatedMembership': membership});
  }
  public deleteMembership(membership: Membership): Observable<any> {
    return this.http.post(API_URL + '/deletemembership', { deletedMembership: membership});
  }

  public membershipPlans(membershipId: string) {
    const params = new HttpParams().set('_id', membershipId);
    return this.http.get(API_URL + '/getmembershipplans', { params: params });
  }
}
