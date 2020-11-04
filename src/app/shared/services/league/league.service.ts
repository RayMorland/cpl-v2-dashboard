import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { League } from 'app/shared/models/league.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  league: League;

  constructor(
    private http: HttpClient
  ) { }

  public getLeague(): Observable<any> {
    return this.http.get(API_URL + '/getallleagues', {});
  }

  public updateLeague(league: League): Observable<any> {
    return this.http.post(API_URL + '/updateleague', { 'updatedLeague': league});
  }
}
