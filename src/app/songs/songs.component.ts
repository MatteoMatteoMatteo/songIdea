import { SongService } from "./song.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "app-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.scss"],
})
export class SongsComponent implements OnInit {
  @ViewChild("switchTab", { static: false }) switchTab: MatTabGroup;
  songOn = false;

  constructor(private songService: SongService) {}

  onSwitchTab() {
    const tabGroup = this.switchTab;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex - 1) % tabCount;
  }

  ngOnInit(): void {
    this.songService.stopAllVideo();
  }
}
