import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuth);
  }
}
