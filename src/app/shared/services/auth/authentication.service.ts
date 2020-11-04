import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, Subject, of, BehaviorSubject } from "rxjs";
import { map, catchError, delay, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Hub, ICredentials } from "@aws-amplify/core";
import { CognitoUser } from "amazon-cognito-identity-js";
import { MembersService } from "../members/members.service";
import { AmplifyService } from "aws-amplify-angular";
const API_URL = environment.apiURL;

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  // body: {
  token: string;
  user: any;
  // };
  // headers: {};
}

export interface TokenPayload {
  email: string;
  password: string;
  userType: string;
  name?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  public static SIGN_IN = "signIn";
  public static SIGN_OUT = "signOut";
  public static FACEBOOK = CognitoHostedUIIdentityProvider.Facebook;
  public static GOOGLE = CognitoHostedUIIdentityProvider.Google;
  private token: string;
  public loggedIn: boolean;
  public authState: BehaviorSubject<any> = new BehaviorSubject<any>({});
  $authState: Observable<any> = this.authState.asObservable();

  public member: string;
  memberChange: Subject<any> = new Subject<any>();

  newAccessToken: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private membersService: MembersService,
    private amplifyService: AmplifyService
  ) {}

  changeMember(member: string) {
    this.memberChange.next(member);
  }

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(API_URL + `/register`, user).pipe(
      map((data: TokenResponse) => {
        // Use data to set token, coordinator info, and login coordinator
        return data;
      }),
      catchError((e: Response) => throwError(e))
    );
  }

  public authenticate(token: any): Observable<any> {
    return this.http.post(
      API_URL + "/authenticate",
      { h: "h" },
      { headers: { Authorization: token } }
    );
  }

  public signIn(
    username: string,
    password: string
  ): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
        .then((user: CognitoUser | any) => {
          this.loggedIn = true;
          resolve(user);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  public signUp(newMember: any): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signUp(newMember.email, newMember.password)
        .then((user: CognitoUser | any) => {
          const member = newMember;
          member.cognitoId = user.userSub;
          this.membersService.createMember(member).subscribe(
            (res) => {
              this.changeMember(res[0]);
              window.localStorage.setItem("memberId", res[0]._id);
              this.loggedIn = true;
              resolve(user);
            },
            (err) => {
              console.error(err);
              reject(err);
            }
          );
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.loggedIn = false;
      window.localStorage.removeItem("memberId");
      // if (this.router.url.includes("profile")) {
      this.router.navigate(["/login"]);
      // }
    });
  }

  public socialSignIn(
    provider: CognitoHostedUIIdentityProvider
  ): Promise<ICredentials> {
    return Auth.federatedSignIn({
      provider: provider,
    });
  }

  public loggedInUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((res) => {
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    });
  }

  public session(): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.currentSession()
        .then((res) => {
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    });
  }

  public currentAuthState(): Observable<any> {
    return this.$authState;
  }

  refreshAccessToken(): Observable<any> {
    // this is just simulating a delay to make it more realistic
    return of('foo').pipe();
  }
}
