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
  isLoading = true;
  loadingSub: Subscription;
  myUploadedSongsSub: Subscription;
  allCommentsSubscription: Subscription;
  allMyHeartsSubscription: Subscription;
  dropStatesSub: Subscription;
  myUploadedSongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();

  whichAudioArray: string = "myUploadedSongs";
  justALittleDelay = true;

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
    this.uid = localStorage.getItem("uid");
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
      if (this.justALittleDelay && !isLoading) {
        setTimeout(() => {
          this.justALittleDelay = false;
        }, 3000);
      }
    });
    this.myUploadedSongsSub = this.songService.myUploadedSongsListed.subscribe((songs) => {
      this.myUploadedSongs = songs;
      this.init();
    });

    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
      this.songService.fetchMyUploads(uid);
    });
  }

  dropSong(id: number) {
    this.songService.dropMyUploadedSong(id);
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

  onNextPage(date: any, name: string) {
    this.songService.myUploadsNext(this.uid, name, date);
  }

  onPrevPage(date: any, name: string) {
    this.songService.myUploadsPrevious(this.uid, name, date);
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
    this.myUploadedSongs.forEach((song) => {
      if (song.playerHolder == null) {
        song.playerHolder = new window["YT"].Player(song.videoId, {
          videoId: song.videoId,
          width: 300,
          start: 100,
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
          events: {
            onStateChange: this.onPlayerStateChange.bind(this),
            onReady: this.onPlayerReady.bind(this),
          },
        });
      }
    });
  }

  onPlayerStateChange(event) {
    if (event.target.getPlayerState() == 1 && event.target.isMuted()) {
      event.target.pauseVideo();
    }
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }

  onPlayerReady(event) {
    event.target.mute();
    event.target.seekTo(50);
  }

  ngOnDestroy() {
    this.myUploadedSongsSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.allCommentsSubscription.unsubscribe();
    this.songService.hideAudioPlayer = true;
  }
}
