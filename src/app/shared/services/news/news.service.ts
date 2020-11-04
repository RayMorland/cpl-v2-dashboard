import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { News } from 'app/shared/models/news.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  news: News;

  constructor(
    private http: HttpClient
  ) { }

  public getNews(): Observable<any> {
    return this.http.get(API_URL + '/getnews', {});
  }
  public findNews(newsId: string): Observable<any> {
    const params = new HttpParams().set('_id', newsId);
    return this.http.get(API_URL + '/findnews', { params: params });
  }
  public createNews(news: News): Observable<any> {
    return this.http.post(API_URL + '/createnews', { 'newNews': news });
  }
  public updateNews(id: string, news: News): Observable<any> {
    return this.http.post(API_URL + '/updatenews', { '_id': id, 'updatedNews': news });
  }
  public deleteNews(news: News): Observable<any> {
    return this.http.post(API_URL + '/deletenews', { 'removedNews': news });
  }
}
