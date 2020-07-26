import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit {
  @Output() upload = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  onUpload() {
    this.upload.emit();
  }
}
