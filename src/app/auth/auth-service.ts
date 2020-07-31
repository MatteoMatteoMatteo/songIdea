import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";

import { User } from "./user.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authSuccessfully();
  }

  logout() {
    this.user = null;
    this.authCancel();
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(["/songs"]);
  }

  private authCancel() {
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }
}
