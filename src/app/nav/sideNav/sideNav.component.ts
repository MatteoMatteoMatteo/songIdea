import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-sideNav",
  templateUrl: "./sideNav.component.html",
  styleUrls: ["./sideNav.component.scss"],
})
export class SideNavComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closeSidenav() {
    this.close.emit();
  }
}
