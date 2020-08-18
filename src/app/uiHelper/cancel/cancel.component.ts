import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-cancel",
  templateUrl: "./cancel.component.html",
  styleUrls: ["./cancel.component.scss"],
})
export class CancelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dataPassed: any) {}
}
