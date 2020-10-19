import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { AuthService } from "./../auth/auth-service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  email: string;
  isLoading = true;
  loadingSub: Subscription;
  constructor(private authService: AuthService, private uiHelperService: UiHelperService) {}

  ngOnInit(): void {
    this.email = localStorage.getItem("email");
  }

  onLogout() {
    this.authService.logout();
  }

  onDeleteAccount() {
    this.authService.deleteAccount();
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }
}
