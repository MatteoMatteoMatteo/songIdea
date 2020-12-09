import { SongService } from "./../songs/song.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent implements OnInit {
  constructor(private songService: SongService) {}

  searchCriteria1=1;
  searchCriteria2=2;

  isActive = false;
  songOn = false;

  handleSwitch(value: boolean) {
    if (value) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }

  ngOnInit(): void {}
}
