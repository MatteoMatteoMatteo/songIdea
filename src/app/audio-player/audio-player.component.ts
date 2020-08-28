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
  spinnerStyling = "smallSpinner";
  playStopTitle = "PLAY | STOP";

  mySongs: Song[] = [];
  mySongSubscription: Subscription;
  constructor(private store: Store<fromRoot.State>, private songService: SongService) {}

  ngOnInit(): void {
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
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
  }
}
