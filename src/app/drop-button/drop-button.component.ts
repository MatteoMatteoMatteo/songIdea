import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-drop-button",
  templateUrl: "./drop-button.component.html",
  styleUrls: ["./drop-button.component.scss"],
})
export class DropButtonComponent implements OnInit {
  @Input() spinnerStyling: string;
  @Input() buttonStyling: string;
  @Output() dropped: EventEmitter<any> = new EventEmitter();
  @Input() dropStates: boolean;
  @Input() songsLoading: boolean;
  @Input() buttonTitle: string;

  constructor() {}

  ngOnInit(): void {}

  onDrop() {
    this.dropped.emit();
  }
}
