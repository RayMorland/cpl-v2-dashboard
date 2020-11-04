import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = API_URL;

  apiUrls = [
    { getMeets: '/getmeets' },
    { findMeet: '' },
  ];


  constructor() { }

  getUrl(requestUrl: string): string {

    for (const url of this.apiUrls) {
      if (url[requestUrl]) {
        return this.apiUrl + url[requestUrl];
      }
    }
    return '404';
  }
}
