import { SongService } from "./../songs/song.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent implements OnInit {
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songService.stopAllVideo();
  }
}
