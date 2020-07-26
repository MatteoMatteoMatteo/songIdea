import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-cancel",
  template: `<h1 mat-dialog-title>Are you sure?</h1>
    <mat-dialog-content>
      <p>You arleady got {{ dataPassed.progress }}%</p></mat-dialog-content
    >
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>`,
  styleUrls: ["./cancel.component.scss"],
})
export class CancelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dataPassed: any) {}
}
