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
  smallPitchButton = "smallPitchButton";
  playPauseButton = "bigDropButton";
  spinnerStyling = "bigSpinner";
  playStopTitle = "DROP";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  uid: string;
  isLoading: boolean;
  loadingSub: Subscription;
  mySongSubscription: Subscription;
  allCommentsSubscription: Subscription;
  allMyHeartsSubscription: Subscription;
  mySongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();

  public YT: any;
  public video: any;
  private player: any;
  public reframed: Boolean = false;

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
      console.log(this.mySongs);
      this.init();
    });
    this.allMyHeartsSubscription = this.songService.allMyUploadHeartsListed.subscribe((songs) => {
      this.mySongs = songs;
    });

    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
      this.songService.fetchMyUploads(uid);
    });
    this.commentService.fetchAllComments();
  }

  dropMySong(id: number) {
    this.songService.dropMySong(id);
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
  }

  onDelete(songId: string, heartDocId: string, name: string) {
    const dialogRef = this.dialog.open(CancelComponent, {
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exit.emit();
        this.songService.deleteSong(songId, heartDocId);
      }
    });
  }

  init() {
    if (window["YT"]) {
      window["YT"] = null;
    }
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => this.startVideo();
  }

  startVideo() {
    this.reframed = false;
    this.mySongs.forEach((song) => {
      song.playerHolder = new window["YT"].Player(song.videoId, {
        videoId: song.videoId,
        width: 300,
        height: 200,
        playerVars: {
          autoplay: 0,
          modestbranding: 0,
          controls: 0,
          disablekb: 1,
          rel: 0,
          ecver: 2,
          fs: 0,
          playsinline: 0,
        },
      });
    });
  }

  ngOnDestroy() {
    this.mySongSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
    this.allCommentsSubscription.unsubscribe();
  }
}
