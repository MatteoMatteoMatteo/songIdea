import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class UiHelperService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration,
    });
  }
}
