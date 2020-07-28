import { SongService } from "./../song.service";
import { Component, OnInit } from "@angular/core";
import { Song } from "../song.model";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit {
  mySongs: Song[] = [];
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.mySongs = this.songService.getMySongs();
  }

  onPlay(id: string) {
    this.songService.playSong(id);
  }
}
