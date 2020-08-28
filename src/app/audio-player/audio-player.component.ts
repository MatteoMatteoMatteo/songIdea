import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Song } from "./../songs/song.model";
import { SongService } from "./../songs/song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";

@Component({
  selector: "app-audio-player",
  templateUrl: "./audio-player.component.html",
  styleUrls: ["./audio-player.component.scss"],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  songsLoading: boolean[] = [];
  songsLoadingSub: Subscription;
  dropStates: boolean[] = [];
  dropStatesSub: Subscription;
  buttonStyling = "smallDropButton";
  playPauseButton = "playPauseButton";
  spinnerStyling = "smallSpinner";
  playStopTitle = "PLAY | STOP";
  nextTitle = "NEXT";
  previousTitle = "BACK";
  mySongs: Song[] = [];
  mySongSubscription: Subscription;
  whichSongIsDroppingSub: Subscription;
  loadingSub: Subscription;
  isLoading = true;
  whichSongIsDropping = 0;
  constructor(
    private store: Store<fromRoot.State>,
    private songService: SongService,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit(): void {
    this.whichSongIsDroppingSub = this.songService.whichSongIsDroppingListed.subscribe((songId) => {
      this.whichSongIsDropping = songId;
    });
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
      console.log(this.mySongs);
    });
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.songsLoadingSub = this.songService.songLoadingListed.subscribe((songsLoading) => {
      this.songsLoading = songsLoading;
    });
  }

  dropSong(id) {
    this.songService.dropSong(id);
  }

  ngOnDestroy() {
    this.mySongSubscription.unsubscribe();
    this.whichSongIsDroppingSub.unsubscribe();
    this.dropStatesSub.unsubscribe();
    this.songsLoadingSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
