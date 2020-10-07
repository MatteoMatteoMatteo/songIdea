import { CommentService } from "./../../comments/comment.service";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { CancelComponent } from "./../../uiHelper/cancel/cancel.component";
import { SongService } from "./../song.service";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Song } from "../song.model";
import { Comment } from "./../../comments/comment.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit, OnDestroy {
  smallPitchButton = "smallPitchButton";
  playPauseButton = "bigDropButton";
  spinnerStyling = "bigSpinner";
  playStopTitle = "DROP";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  isLoading: boolean;
  loadingSub: Subscription;
  mySavedSongsSubscription: Subscription;
  allCommentsSubscription: Subscription;
  mySongs: Song[] = [];
  mySavedSongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();

  public YT: any;
  public video: any;
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
    this.mySavedSongsSubscription = this.songService.mySavedSongsListed.subscribe((songs) => {
      this.mySavedSongs = songs;
      console.log(this.mySavedSongs);
      this.init();
    });
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.songService.fetchMySavedSongs(uid);
    });
    this.commentService.fetchAllComments();
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
  }

  dropMySavedSong(id: number) {
    this.songService.dropMySavedSong(id);
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
    this.mySavedSongs.forEach((song) => {
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
    });
  }

  onPlayerStateChange(event) {
    if (event.target.getPlayerState() == 1 && event.target.isMuted()) {
      event.target.pauseVideo();
    }
  }

  onPlayerReady(event) {
    event.target.mute();
    event.target.seekTo(50);
  }

  ngOnDestroy() {
    this.mySavedSongsSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
    this.allCommentsSubscription.unsubscribe();
  }
}
