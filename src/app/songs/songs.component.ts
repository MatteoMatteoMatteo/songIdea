import { SongService } from "./song.service";
import { Subscription } from "rxjs/subscription";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.scss"],
})
export class SongsComponent implements OnInit, OnDestroy {
  songOn = false;
  songSubscription: Subscription;

  constructor(private songService: SongService) {}

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
