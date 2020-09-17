import { SongService } from "./../../songs/song.service";
import { Song } from "./../../songs/song.model";
import { CommentService } from "../../comments/comment.service";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { UiHelperService } from "../../uiHelper/uiHelper.service";
import { CancelComponent } from "../../uiHelper/cancel/cancel.component";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Comment } from "../../comments/comment.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-my-upload",
  templateUrl: "./my-upload.component.html",
  styleUrls: ["./my-upload.component.scss"],
})
export class MyUploadComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  loadingSub: Subscription;
  mySongSubscription: Subscription;
  allCommentsSubscription: Subscription;
  mySongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();
  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private songService: SongService,
    private uiHelperService: UiHelperService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.mySongSubscription = this.songService.mySongsListed.subscribe((songs) => {
      this.mySongs = songs;
    });
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.songService.fetchMySongs(uid);
    });
    this.commentService.fetchAllComments();
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
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
    this.mySongSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
    this.allCommentsSubscription.unsubscribe();
  }
}
