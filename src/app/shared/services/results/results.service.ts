import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Result } from 'app/shared/models/result.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: Result;

  constructor(
    private http: HttpClient
  ) { }

  public getResults(): Observable<any> {
    return this.http.get(API_URL + '/getresults', {});
  }
  public findResult(resultId: string): Observable<any> {
    const params = new HttpParams().set('_id', resultId);
    return this.http.get(API_URL + '/findresult', { params: params });
  }
  public createResult(result: Result): Observable<any> {
    return this.http.post(API_URL + '/createresult', { newResult: result});
  }
  public updateResult(id: string, result: Result): Observable<any> {
    return this.http.post(API_URL + '/updateresult', { '_id': id, 'updatedResult': result});
  }
  public deleteResult(result: Result): Observable<any> {
    return this.http.post(API_URL + '/deleteresult', { deletedResult: result});
  }
}
