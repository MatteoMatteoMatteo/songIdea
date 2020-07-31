import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { SongService } from "./../songs/song.service";
import { Song } from "./../songs/song.model";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading: boolean;
  allSongsSubscription: Subscription;
  allSongs: Song[];
  constructor(private songService: SongService, private uiHelperService: UiHelperService) {}

  ngOnInit(): void {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.allSongsSubscription = this.songService.allSongsListed.subscribe((songs) => {
      this.allSongs = songs;
    });
    this.songService.fetchAllSongs();
  }

  onPlay(id: string) {
    this.songService.playSong(id);
  }

  ngOnDestroy() {
    if (this.allSongsSubscription) {
      this.allSongsSubscription.unsubscribe();
    }
    this.loadingSub.unsubscribe();
  }
}
