import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Member } from '../../models/member.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  member: Member;

  constructor(
    private http: HttpClient
  ) { }

  public getMembers(): Observable<any> {
    return this.http.get(API_URL + '/getmembers', {});
  }

  public getMembersMembership(memberId: string): Observable<any> {
    const params = new HttpParams().set('_id', memberId);
    return this.http.get(API_URL + '/getmembersmembership', { params: params });
  }
  public findMember(search: any): Observable<any> {
    console.log(search);
    return this.http.get(API_URL + '/findmember', { params: search });
  }
  public createMember(member: Member): Observable<any> {
    return this.http.post(API_URL + '/createmember', { newMember: member});
  }
  public adminCreateMember(member: Member): Observable<any> {
    return this.http.post(API_URL + '/admincreatemember', { newMember: member});
  }
  public updateMember(id: string, member: Member): Observable<any> {
    return this.http.post(API_URL + '/updatemember', { '_id': id, 'updatedMember': member});
  }
  public registerMember(id: string, member: Member, paymentInfo: any): Observable<any> {
    return this.http.post(API_URL + '/registermember', { '_id': id, 'updatedMember': member, 'paymentInfo': paymentInfo});
  }
  public deleteMember(member: Member): Observable<any> {
    return this.http.post(API_URL + '/deletemember', { deletedMember: member});
  }
  public getMembersRegistrations(MemberId: string): Observable<any> {
    const params = new HttpParams().set('_id', MemberId);
    return this.http.get(API_URL + '/getmembersregistrations', { params: params });
  }

  public getMembersRecords(memberId: string): Observable<any> {
    return this.http.get(API_URL + '/getmembersrecords', { params: { _id: memberId }});
  }

  public getMembersResults(memberId: string): Observable<any> {
    return this.http.get(API_URL + '/getmembersresults', { params: { _id: memberId }});
  }

  public setMember(member: Member) {
    this.member = member;
    window.sessionStorage.setItem('memberId', member._id);
  }

  public getMember(): Member {
    return this.member;
  }
}
