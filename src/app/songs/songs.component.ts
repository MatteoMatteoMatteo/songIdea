import { SongService } from "./song.service";
import { Subscription } from "rxjs/subscription";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.scss"],
})
export class SongsComponent implements OnInit {
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
}
