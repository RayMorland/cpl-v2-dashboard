import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";
import Auth from "@aws-amplify/auth";
import { MembersService } from "../members/members.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private membersService: MembersService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(["/login"]);
          resolve(false);
        });
    });
  }
}
