import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../auth/authentication.service";
import { environment } from "../../../../environments/environment";
import { FormGroup } from "@angular/forms";
import { Observable, BehaviorSubject } from "rxjs";
import { Media } from "app/shared/models/media.model";
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class MediaService {
  media: Media;

  private mediaUpdated: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.mediaUpdated = new BehaviorSubject<string>('');
  }

  public getMediaUpdated(): Observable<string> {
    return this.mediaUpdated.asObservable();
  }

  public setMediaUpdated(newValue: string): void {
    this.mediaUpdated.next(newValue);
}

  public getAllMedia(): Observable<any> {
    return this.http.get(API_URL + "/getallmediaitems", {});
  }
  public findMedia(mediaId: string): Observable<any> {
    const params = new HttpParams().set("_id", mediaId);
    return this.http.get(API_URL + "/findmediaitem", { params: params });
  }
  public createMedia(media: Media): Observable<any> {
    return this.http.post(API_URL + "/createmedia", { newMedia: media });
  }
  public updateMedia(id: string, media: Media): Observable<any> {
    return this.http.post(API_URL + "/updatemedia", {
      _id: id,
      updatedMedia: media
    });
  }
  public deleteMedia(media: Media): Observable<any> {
    return this.http.post(API_URL + "/deletemedia", { deletedMedia: media });
  }
}
