import { AuthService } from "./../../auth/auth-service";
import { Component, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sideNav",
  templateUrl: "./sideNav.component.html",
  styleUrls: ["./sideNav.component.scss"],
})
export class SideNavComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
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
    this.closeSidenav();
    this.authServcie.logout();
  }

  closeSidenav() {
    this.close.emit();
  }
}
