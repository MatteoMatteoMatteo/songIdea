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

  constructor(private songService: SongService) {}

  public onSwitchTab() {
    const tabGroup = this.switchTab;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex - 1) % tabCount;
  }

  ngOnInit(): void {}
}
