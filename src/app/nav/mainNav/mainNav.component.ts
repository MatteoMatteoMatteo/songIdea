import { AuthService } from "./../../auth/auth-service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-mainNav",
  templateUrl: "./mainNav.component.html",
  styleUrls: ["./mainNav.component.scss"],
})
export class MainNavComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, private authServcie: AuthService) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  handleLogout() {
    this.authServcie.logout();
  }

  toggleSidenav() {
    this.toggle.emit();
    console.log(this.isAuth$);
  }
}
