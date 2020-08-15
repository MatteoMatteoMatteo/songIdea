import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { AuthService } from "./../auth-service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading = false;
  constructor(private authService: AuthService, private uiHelperService: UiHelperService) {}

  ngOnInit(): void {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password,
    });
    // setTimeout(() => {
    //   this.authService.logout();
    // }, 1000 * 200);
  }
}
