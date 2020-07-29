import { SongService } from "./../song.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Song } from "../song.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit, OnDestroy {
  songSubscription: Subscription;
  songs: Song[];
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songSubscription = this.songService.mySongsChanged.subscribe((songs) => {
      this.songs = songs;
    });
    this.songService.fetchSongs();
  }

  onPlay(id: string) {
    this.songService.playSong(id);
  }

  ngOnDestroy() {
    this.songSubscription.unsubscribe();
  }
}
