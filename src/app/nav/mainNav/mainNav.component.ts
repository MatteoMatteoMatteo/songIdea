import { AuthService } from "./../../auth/auth-service";
import { Component, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-mainNav",
  templateUrl: "./mainNav.component.html",
  styleUrls: ["./mainNav.component.scss"],
})
export class MainNavComponent implements OnInit, OnDestroy {
  @Output() toggle = new EventEmitter<void>();
  isAuth = false;
  authSub: Subscription;

  constructor(private authServcie: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authServcie.authChange.subscribe((authStat) => {
      this.isAuth = authStat;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  handleLogout() {
    this.authServcie.logout();
  }

  toggleSidenav() {
    this.toggle.emit();
  }
}
