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
  public isAuth: boolean;
  public uid = "asdasd";

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private uiHelperService: UiHelperService,
    private store: Store<fromRoot.State>,
    private songService: SongService
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuth = true;
        this.uid = user.uid;
        this.store.dispatch(new AUTH.SetAuthenticated());
        this.store.dispatch(new AUTH.Uid(user.uid));
        this.router.navigate(["/browse"]);
      } else {
        this.store.dispatch(new AUTH.SetUnauthenticated());
        this.router.navigate(["/browse"]);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        let res = result;
        localStorage.setItem("uid", result.user.uid);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiHelperService.showSnackbar(error.message, "ok", 4000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        let res = result;
        localStorage.setItem("uid", result.user.uid);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiHelperService.showSnackbar(error.message, "ok", 4000);
      });
  }

  logout() {
    localStorage.removeItem("uid");
    this.isAuth = false;
    this.router.navigate(["/"]);
    this.songService.cancelSub();
    this.angularFireAuth.signOut();
  }
}
