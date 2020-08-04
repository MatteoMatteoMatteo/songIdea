import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { CancelComponent } from "./../../uiHelper/cancel/cancel.component";
import { SongService } from "./../song.service";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Song } from "../song.model";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading: boolean;
  mySongSubscription: Subscription;
  allSongsSubscription: Subscription;
  mySongs: Song[] = [];
  @Output() exit = new EventEmitter();
  constructor(
    private dialog: MatDialog,
    private songService: SongService,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
    });
    this.songService.fetchMySongs();
  }

  onPlay(id: string) {
    this.songService.playSong(id);
  }

  onDelete(id: string, name: string) {
    const dialogRef = this.dialog.open(CancelComponent, {
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exit.emit();
        this.songService.deleteSong(id);
      }
    });
  }

  ngOnDestroy() {
    if (this.mySongSubscription) {
      this.mySongSubscription.unsubscribe();
    }
    this.loadingSub.unsubscribe();
  }
}
