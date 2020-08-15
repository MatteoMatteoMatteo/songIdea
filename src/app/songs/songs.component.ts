import { SongService } from "./song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "app-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.scss"],
})
export class SongsComponent implements OnInit, OnDestroy {
  @ViewChild("switchTab", { static: false }) switchTab: MatTabGroup;
  songOn = false;
  songSubscription: Subscription;

  constructor(private songService: SongService) {}

  onSwitchTab() {
    const tabGroup = this.switchTab;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex - 1) % tabCount;
  }

  ngOnInit(): void {
    this.songSubscription = this.songService.songPlaying.subscribe((song) => {
      if (song) {
        this.songOn = true;
      } else {
        this.songOn = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.songSubscription) {
      this.songSubscription.unsubscribe();
    }
  }
}
