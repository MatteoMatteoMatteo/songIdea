import { Subscription } from "rxjs";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { SongService } from "./../song.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Song } from "../song.model";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading: boolean;
  mySongSubscription: Subscription;
  allSongsSubscription: Subscription;
  mySongs: Song[];
  constructor(private songService: SongService, private uiHelperService: UiHelperService) {}

  ngOnInit(): void {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
    });
    this.songService.fetchMySongs();
  }

  onPlay(id: string) {
    this.songService.playSong(id);
  }

  onDelete(id: string) {
    this.songService.deleteSong(id);
  }

  ngOnDestroy() {
    if (this.mySongSubscription) {
      this.mySongSubscription.unsubscribe();
    }
    this.loadingSub.unsubscribe();
  }
}
