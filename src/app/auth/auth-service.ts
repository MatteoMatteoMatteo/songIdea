import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SongService } from "./../songs/song.service";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ss: SongService,
    private uiHelperService: UiHelperService
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/songs"]);
      } else {
        this.authCancel();
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiHelperService.loadingStateChanged.next(true);
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiHelperService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiHelperService.loadingStateChanged.next(false);
        this.uiHelperService.showSnackbar(error.message, null, 4000);
      });
  }

  login(authData: AuthData) {
    this.uiHelperService.loadingStateChanged.next(true);
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiHelperService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiHelperService.loadingStateChanged.next(false);
        this.uiHelperService.showSnackbar(error.message, null, 4000);
      });
  }

  logout() {
    this.angularFireAuth.signOut();
    this.ss.cancelSub();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authCancel() {
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }
}
