import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { Subscription } from "rxjs/subscription";
import { AuthService } from "./../auth-service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading = false;
  maxDate: Date;
  constructor(private authService: AuthService, private uiHelperService: UiHelperService) {}

  ngOnInit() {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.maxDate = new Date();
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }
}
