import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { SongService } from "./../songs/song.service";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "./../app.reducer";
import * as UI from "./../uiHelper/ui.actions";
import * as AUTH from "./auth.actions";

@Injectable()
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ss: SongService,
    private uiHelperService: UiHelperService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(new AUTH.SetAuthenticated());
        this.router.navigate(["/songs"]);
      } else {
        this.store.dispatch(new AUTH.SetUnauthenticated());
        this.router.navigate(["/login"]);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    // this.uiHelperService.loadingStateChanged.next(true);
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        let res = result;
        localStorage.setItem("userId", res.user.uid);
        this.store.dispatch(new UI.StopLoading());
        // this.uiHelperService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        // this.uiHelperService.loadingStateChanged.next(false);
        this.uiHelperService.showSnackbar(error.message, null, 4000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    // this.uiHelperService.loadingStateChanged.next(true);
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        let res = result;
        localStorage.setItem("userId", res.user.uid);
        this.store.dispatch(new UI.StopLoading());
        // this.uiHelperService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        // this.uiHelperService.loadingStateChanged.next(false);
        this.uiHelperService.showSnackbar(error.message, null, 4000);
      });
  }

  logout() {
    this.angularFireAuth.signOut();
    this.ss.cancelSub();
  }
}
