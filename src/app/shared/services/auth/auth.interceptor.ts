import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthenticationService } from "./authentication.service";
import { Auth } from "aws-amplify";
import { switchMap, tap } from "rxjs/operators";
import { AmplifyService } from "aws-amplify-angular";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  auth: any;
  sessionToken: any;

  constructor(
    private authenticationService: AuthenticationService,
    private amplifyService: AmplifyService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
      this.auth = this.authenticationService.authState.getValue();
      this.sessionToken = this.auth.user.signInUserSession.accessToken.jwtToken;
      const newRequest = request.clone({
        withCredentials: false,
        setHeaders: {
          Authorization: `Bearer ${this.sessionToken}`,
          'CPL-APP-TYPE': 'admin'
        },
      });
      return next.handle(newRequest);
  }
}
