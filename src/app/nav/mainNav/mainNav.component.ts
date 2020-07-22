import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-mainNav",
  templateUrl: "./mainNav.component.html",
  styleUrls: ["./mainNav.component.scss"],
})
export class MainNavComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  toggleSidenav() {
    this.toggle.emit();
  }
}
