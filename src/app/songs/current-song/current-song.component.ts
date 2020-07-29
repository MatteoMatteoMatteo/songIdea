import { Song } from "./../song.model";
import { SongService } from "./../song.service";
import { CancelComponent } from "./../../helper/cancel/cancel.component";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs/subscription";

@Component({
  selector: "app-current-song",
  templateUrl: "./current-song.component.html",
  styleUrls: ["./current-song.component.scss"],
})
export class CurrentSongComponent implements OnInit {
  songSubscription: Subscription;
  mySongs: Song[];
  progress = 0;
  timer: number;
  @Output() exit = new EventEmitter();

  constructor(public dialog: MatDialog, private songService: SongService) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(CancelComponent, {
      data: {
        progress: this.progress,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exit.emit();
      }
    });
  }
}
