import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Record } from 'app/shared/models/record.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  record: Record;

  constructor(
    private http: HttpClient
  ) { }

  public getRecords(): Observable<any> {
    return this.http.get(API_URL + '/getrecords', {});
  }
  public findRecord(RecordsId: string): Observable<any> {
    const params = new HttpParams().set('_id', RecordsId);
    return this.http.get(API_URL + '/findrecord', { params: params });
  }
  public createRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/createrecord', { newRecord: record });
  }
  public updateRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/updaterecord', { 'updatedRecord': record });
  }
  public deleteRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/deleterecord', { deletedRecord: record });
  }
  public getResultFromRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/getresultfromrecord', { 'record': record });
  }
}
