import { Song } from "./../../songs/song.model";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-song-card",
  templateUrl: "./song-card.component.html",
  styleUrls: ["./song-card.component.scss"],
})
export class SongCardComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() allSongs: Song[];

  constructor() {}

  ngOnInit(): void {}
}
