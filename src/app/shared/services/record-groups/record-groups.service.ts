import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RecordGroup } from 'app/shared/models/record-group.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecordGroupsService {

  ecordGroup: RecordGroup;

  constructor(
    private http: HttpClient
  ) { }

  public getRecordGroups(): Observable<any> {
    return this.http.get(API_URL + '/getrecordgroups', {});
  }
  public findRecordGroup(recordGroupsId: string): Observable<any> {
    const params = new HttpParams().set('_id', recordGroupsId);
    return this.http.get(API_URL + '/findrecordgroup', { params: params });
  }
  public createRecordGroup(recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/createrecordgroup', { newRecordGroup: recordGroup });
  }
  public updateRecordGroup(id: string, recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/updaterecordgroup', { '_id': id, 'updatedRecordGroup': recordGroup });
  }
  public deleteRecordGroup(recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/deleterecordgroup', { deletedRecordGroup: recordGroup });
  }
}
