import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Song } from "./../songs/song.model";
import { SongService } from "./../songs/song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
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
  loadingSubAll: Subscription;
  loadingSubMy: Subscription;
  startCountdownSub: Subscription;
  destroyMeSub: Subscription;
  fxToggler = false;
  destroyMe = false;
  whichSongIsDropping = 0;
  countdown = 30;

  @Input() audioArray: Song[] = [];
  @Input() whichAudioArray: string;

  isLoading = true;

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
      // this.allSongs = songs;
      this.countdown = 30;
      this.whichSongIsDropping = 0;
    });
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.songsLoadingSub = this.songService.songLoadingListed.subscribe((songsLoading) => {
      this.songsLoading = songsLoading;
    });
    this.loadingSubAll = this.uiHelperService.allSongsLoadingStateChanged.subscribe((isLoading) => {
      if (isLoading == false) {
        setTimeout(() => {
          this.isLoading = isLoading;
        }, 2000);
      } else {
        this.isLoading = isLoading;
      }
    });
    this.loadingSubMy = this.uiHelperService.mySavedSongsLoadingStateChanged.subscribe(
      (isLoading) => {
        if (isLoading == false) {
          setTimeout(() => {
            this.isLoading = isLoading;
          }, 2000);
        } else {
          this.isLoading = isLoading;
        }
      }
    );
  }

  dropSong(id: number) {
    if (this.whichAudioArray === "allSongs") {
      this.songService.dropSong(id);
    } else if (this.whichAudioArray === "mySavedSongs") {
      this.songService.dropMySavedSong(id);
    }
  }

  fxToggle() {
    this.fxToggler = !this.fxToggler;
  }

  onPitchChange(id: number, event: MatSliderChange) {
    this.songService.changePitch(id, event.value, this.whichAudioArray);
  }
  onVolumeChange(id: number, event: MatSliderChange) {
    this.songService.changeVolume(id, event.value, this.whichAudioArray);
  }
  onFx1Change(id: number, event: MatSliderChange) {
    this.songService.changeFx1(id, event.value);
  }
  onFx2Change(id: number, event: MatSliderChange) {
    this.songService.changeFx2(id, event.value);
  }

  ngOnDestroy() {
    if (this.allSongSubscription) this.allSongSubscription.unsubscribe();
    if (this.whichSongIsDroppingSub) this.whichSongIsDroppingSub.unsubscribe();
    if (this.dropStatesSub) this.dropStatesSub.unsubscribe();
    if (this.songsLoadingSub) this.songsLoadingSub.unsubscribe();
    if (this.loadingSubAll) this.loadingSubAll.unsubscribe();
    if (this.loadingSubMy) this.loadingSubMy.unsubscribe();
    if (this.destroyMeSub) this.destroyMeSub.unsubscribe();
    if (this.startCountdownSub) this.startCountdownSub.unsubscribe();
    this.songService.stopAllVideo();
  }
}
