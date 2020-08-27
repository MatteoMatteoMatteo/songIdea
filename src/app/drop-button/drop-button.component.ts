import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-drop-button",
  templateUrl: "./drop-button.component.html",
  styleUrls: ["./drop-button.component.scss"],
})
export class DropButtonComponent implements OnInit {
  @Output() dropped: EventEmitter<any> = new EventEmitter();
  @Input() dropState: boolean;
  @Input() songLoading: boolean;

  constructor() {}

  ngOnInit(): void {}

  onDrop() {
    this.dropped.emit();
  }
}
