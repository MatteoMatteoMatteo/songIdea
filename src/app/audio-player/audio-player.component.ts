import { Song } from "./../songs/song.model";
import { SongService } from "./../songs/song.service";
import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as Tone from "tone";

@Component({
  selector: "app-audio-player",
  templateUrl: "./audio-player.component.html",
  styleUrls: ["./audio-player.component.scss"],
})
export class AudioPlayerComponent implements OnInit {
  toneSounds: Tone.Player[];
  mySongs: Song[] = [];
  allPlayersSubscription: Subscription;
  mySongSubscription: Subscription;
  constructor(private store: Store<fromRoot.State>, private songService: SongService) {}

  ngOnInit(): void {
    this.allPlayersSubscription = this.songService.allPlayersListed.subscribe((players) => {
      this.toneSounds = players;
    });
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
    });
  }

  lol() {
    if (this.toneSounds[0].state === "stopped") {
      this.toneSounds.forEach((song) => {
        song.stop();
      });
      if (this.toneSounds[0].loaded === false) {
        this.toneSounds[0].load(this.mySongs[0].path).then((song) => {
          song.start();
        });
      } else {
        this.toneSounds[0].start();
      }
    } else {
      this.toneSounds[0].stop();
    }
  }
}
