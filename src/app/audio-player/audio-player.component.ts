import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Song } from "./../songs/song.model";
import { SongService } from "./../songs/song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import { MatSliderChange } from "@angular/material/slider";

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
  smallPitchButton = "smallPitchButton";
  playPauseButton = "playPauseButton";
  spinnerStyling = "smallSpinner";
  playStopTitle = "PLAY | STOP";
  nextTitle = "NEXT";
  previousTitle = "BACK";
  pitchMeUpTitle = "PU";
  pitchMeDownTitle = "PD";
  allSongs: Song[] = [];
  allSongSubscription: Subscription;
  whichSongIsDroppingSub: Subscription;
  loadingSub: Subscription;
  startCountdownSub: Subscription;
  isLoading = true;
  whichSongIsDropping = 0;
  countdown = 30;
  constructor(
    private store: Store<fromRoot.State>,
    private songService: SongService,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit(): void {
    this.whichSongIsDroppingSub = this.songService.whichSongIsDroppingListed.subscribe((songId) => {
      this.whichSongIsDropping = songId;
    });
    this.startCountdownSub = this.songService.startCountdownListed.subscribe((number) => {
      this.countdown = number;
    });
    this.allSongSubscription = this.songService.allSongsListed.subscribe((songs) => {
      this.allSongs = songs;
    });
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.songsLoadingSub = this.songService.songLoadingListed.subscribe((songsLoading) => {
      this.songsLoading = songsLoading;
    });
    this.loadingSub = this.uiHelperService.allSongsLoadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  dropSong(id: number) {
    this.songService.dropSong(id);
  }

  onPitchChange(id: number, event: MatSliderChange) {
    this.songService.changePitch(id, event.value);
  }
  onVolumeChange(id: number, event: MatSliderChange) {
    this.songService.changeVolume(id, event.value);
  }

  ngOnDestroy() {
    this.allSongSubscription.unsubscribe();
    this.whichSongIsDroppingSub.unsubscribe();
    this.dropStatesSub.unsubscribe();
    this.songsLoadingSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
