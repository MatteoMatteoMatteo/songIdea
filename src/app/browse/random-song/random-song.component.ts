import { Song } from "./../../songs/song.model";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-random-song",
  templateUrl: "./random-song.component.html",
  styleUrls: ["./random-song.component.scss"],
})
export class RandomSongComponent implements OnInit {
  @Input() randomSong: Song;
  @Input() isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
