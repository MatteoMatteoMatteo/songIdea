import { AuthService } from "./../../auth/auth-service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-sideNav",
  templateUrl: "./sideNav.component.html",
  styleUrls: ["./sideNav.component.scss"],
})
export class SideNavComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authServcie: AuthService, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  handleLogout() {
    this.closeSidenav();
    this.authServcie.logout();
  }

  closeSidenav() {
    this.close.emit();
  }
}
