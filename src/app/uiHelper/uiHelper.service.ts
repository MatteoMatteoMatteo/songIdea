import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class UiHelperService {
  loadingStateChanged = new Subject<boolean>();
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ["red-snackbar"],
    });
  }
}
