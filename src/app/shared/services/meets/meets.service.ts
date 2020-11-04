import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { Meet } from 'app/shared/models/meet.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MeetsService {

  public initialFilters = {
    minPrice: 10,
    maxPrice: 40,
    minRating: 1,
    maxRating: 5
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  public filterMeets(meets: Meet[], filter: any): Meet[] {
    console.log(filter);
    const searchArray = filter.searchString.toLowerCase().split(' ');
    const uniqueString = [];
    searchArray.forEach(item => {
      if (item === '') {
        return;
      } else if (uniqueString.indexOf(item) === -1) {
        uniqueString.push(item);
      }
    });
    let filteredMeets = [];
    let filteredIndex = 0;
    if (uniqueString.length > 0) {
      for (let k = 0; k < meets.length; k++) {
        const meetArray = meets[k].title.toLowerCase().split(' ');
        const dateArray = [];
        if (meets[k].dates[0].start !== null) {
          let startDate = new Date(meets[k].dates[0].start);
          dateArray.push(startDate.getFullYear().toString());
          dateArray.push(
            startDate.toLocaleString('default', { month: 'long' }).toLowerCase()
          );
        }
        const locationArray = [];
        if (meets[k].venue.location.address) {
          locationArray.push(
            meets[k].venue.location.address.city.toLowerCase()
          );
          locationArray.push(
            meets[k].venue.location.address.country.toLowerCase()
          );
          locationArray.push(
            meets[k].venue.location.address.province.toLowerCase()
          );
        }

        for (let i = 0; i < uniqueString.length; i++) {
          if (uniqueString.length <= meetArray.length) {
            if (
              (meetArray.some(item => item.includes(uniqueString[i])) ||
                dateArray.some(item => item.includes(uniqueString[i])) ||
                locationArray.some(item => item.includes(uniqueString[i]))) &&
              filteredMeets.indexOf(meets[k]) === -1
            ) {
              filteredMeets.push(meets[k]);
              filteredIndex += 1;
            } else if (
              !(
                meetArray.some(item => item.includes(uniqueString[i])) ||
                dateArray.some(item => item.includes(uniqueString[i])) ||
                locationArray.some(item => item.includes(uniqueString[i]))
              ) &&
              filteredMeets.indexOf(meets[k]) !== -1
            ) {
              filteredIndex -= 1;
              filteredMeets.splice(filteredIndex, 1);
            }
          }
        }
      }
      if (filter.completed !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          const meetDate = new Date(meet.dates[0].start);
          const now = new Date();
          if (filter.completed === 'upcoming') {
            if (meetDate >= now) {
              return meet;
            }
          } else if (filter.completed === 'past') {
            if (meetDate < now) {
              return meet;
            }
          }
        });
      }
      if (filter.status !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          if (meet.status === filter.status) {
            return meet;
          }
        });
      }
      if (filter.province !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          if (meet.venue.location.address.province === filter.province) {
            return meet;
          }
        });
      }
      if (filter.year !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          const startDate = new Date(meet.dates[0].start).getFullYear();
          if (startDate === filter.year) {
            return meet;
          }
        });
      }
    } else {
      filteredMeets = meets;
      if (filter.completed !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          const meetDate = new Date(meet.dates[0].start);
          const now = new Date();
          if (filter.completed === 'upcoming') {
            if (meetDate >= now) {
              return meet;
            }
          } else if (filter.completed === 'past') {
            if (meetDate < now) {
              return meet;
            }
          }
        });
      }
      if (filter.status !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          if (meet.status === filter.status) {
            return meet;
          }
        });
      }
      if (filter.province !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          if (meet.venue.location.address.province === filter.province) {
            return meet;
          }
        });
      }
      if (filter.year !== null) {
        filteredMeets = filteredMeets.filter(meet => {
          const startDate = new Date(meet.dates[0].start).getFullYear();
          if (startDate === filter.year) {
            return meet;
          }
        });
      }
    }

    return filteredMeets;
  }

  public getPastMeets(meets: Meet[]): Meet[] {
    const pastMeets = meets.filter(meet => {
      const now = new Date();
      if (meet.dates.length > 0 && now >= new Date(meet.dates[0].start)) {
        return meet;
      }
    });
    return pastMeets;
  }

  public getUpcomingMeets(meets: Meet[]): Meet[] {
    const upcomingMeets = meets.filter(meet => {
      const now = new Date();
      if (meet.dates.length > 0 && now < new Date(meet.dates[0].start)) {
        return meet;
      }
    });
    return upcomingMeets;
  }

  public getMeets(): Observable<any> {
    return this.http.get(this.apiService.getUrl('getMeets'), {});
  }

  public findMeet(_id: string): Observable<any> {
    const params = new HttpParams().set('_id', _id);
    return this.http.get(API_URL + '/findmeet', { params: params });
  }

  public updateMeet(id: string, updatedMeet: any): Observable<any> {
    return this.http.post(API_URL + '/updatemeet', { id, updatedMeet });
  }

  public createMeet(newMeet: any): Observable<any> {
    return this.http.post(API_URL + '/createmeet', { newMeet });
  }

  public changeMeetStatus(id: any, status: string): Observable<any> {
    return this.http.post(API_URL + '/changemeetstatus', { id, status });
  }

  public changeRegistrationOpen(id: any, open: boolean): Observable<any> {
    return this.http.post(API_URL + '/changeregistrationopen ', { id, open });
  }

  public getFilteredMeets(filterForm: FormGroup): Observable<any> {
    return;
  }

  public getMeetRegistrants(meetId: string): Observable<any> {
    const params = new HttpParams().set('_id', meetId);
    return this.http.get(API_URL + '/getmeetregistrations', { params: params });
  }

  public getMeetResults(meetId: string): Observable<any> {
    const params = new HttpParams().set('_id', meetId);
    return this.http.get(API_URL + '/getmeetresults', { params: params });
  }

  public removeMeet(meetId: string): Observable<any> {
    return this.http.post(API_URL + '/removemeet', { meetId });
  }

  public updateMeetResultsLink(id: string, link: any): Observable<any> {
    return this.http.post(API_URL + '/updatemeetresultslink', { id, link });
  }

  public createResultsFromSpreadsheet(meetId: string, file: any) {
    return this.http.post(API_URL + '/createresultsfromspreadsheet', { meetId, file });
  }
}
