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
  mySongs: Song[] = [];
  mySongSubscription: Subscription;
  constructor(private store: Store<fromRoot.State>, private songService: SongService) {}

  ngOnInit(): void {
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
    });
  }

  play() {
    if (this.mySongs[2].player.loaded === false) {
      this.mySongs[2].player.load(this.mySongs[2].path).then(() => {
        this.mySongs[2].player.start();
      });
    } else {
      this.mySongs[2].player.start();
    }
  }

  stop() {
    this.mySongs.forEach((song) => song.player.stop());
  }

  next() {
    this.stop();
    if (this.mySongs[3].player.loaded === false) {
      this.mySongs[3].player.load(this.mySongs[3].path).then(() => {
        this.mySongs[3].player.start();
      });
    } else {
      this.mySongs[3].player.start();
    }
  }

  ngOnDestroy() {
    this.mySongSubscription.unsubscribe();
  }
}
