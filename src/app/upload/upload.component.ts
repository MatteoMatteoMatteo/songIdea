import { SongService } from "./../songs/song.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit {
  @ViewChild("switchTab", { static: false }) switchTab: MatTabGroup;
  songOn = false;
  isActive = false;

  constructor(private songService: SongService) {}

  public onSwitchTab() {
    this.isActive = true;
  }

  handleSwitch(value: boolean) {
    if (value) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }

  ngOnInit(): void {}
}
