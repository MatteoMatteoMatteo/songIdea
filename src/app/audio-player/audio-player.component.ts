import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Song } from "./../songs/song.model";
import { SongService } from "./../songs/song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { Player } from "tone";

@Component({
  selector: "app-audio-player",
  templateUrl: "./audio-player.component.html",
  styleUrls: ["./audio-player.component.scss"],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  phoneButtonStyling = "phoneButtonStyling";
  buttonStyling = "smallDropButton";
  smallPitchButton = "smallPitchButton";
  playPauseButton = "playPauseButton";
  spinnerStyling = "smallSpinner";
  playStopTitle = "PLAY | STOP";
  playStopTitlePhone = "DROP";
  nextTitle = "SKIP";
  previousTitle = "BACK";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  allSongs: Song[] = [];
  songsLoadingSub: Subscription;
  dropStatesSub: Subscription;
  allSongSubscription: Subscription;
  whichSongIsDroppingSub: Subscription;
  loadingSub: Subscription;
  startCountdownSub: Subscription;
  destroyMeSub: Subscription;
  fxToggler = false;
  destroyMe = false;
  isLoading = true;
  whichSongIsDropping = 0;
  countdown = 30;

  constructor(private songService: SongService, private uiHelperService: UiHelperService) {}

  ngOnInit(): void {
    this.whichSongIsDroppingSub = this.songService.whichSongIsDroppingListed.subscribe((songId) => {
      this.whichSongIsDropping = songId;
    });
    this.destroyMeSub = this.songService.destroyAudioPlayer.subscribe((bool) => {
      this.destroyMe = bool;
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

  fxToggle() {
    this.fxToggler = !this.fxToggler;
  }

  onPitchChange(id: number, event: MatSliderChange) {
    this.songService.changePitch(id, event.value);
  }
  onVolumeChange(id: number, event: MatSliderChange) {
    this.songService.changeVolume(id, event.value);
  }
  onFx1Change(id: number, event: MatSliderChange) {
    this.songService.changeFx1(id, event.value);
  }
  onFx2Change(id: number, event: MatSliderChange) {
    this.songService.changeFx2(id, event.value);
  }

  ngOnDestroy() {
    this.allSongSubscription.unsubscribe();
    this.whichSongIsDroppingSub.unsubscribe();
    this.dropStatesSub.unsubscribe();
    this.songsLoadingSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.destroyMeSub.unsubscribe();
    this.startCountdownSub.unsubscribe();
  }
}
