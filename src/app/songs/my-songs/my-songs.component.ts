import { AuthService } from "./../../auth/auth-service";
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
  uid: string;
  smallPitchButton = "smallPitchButton";
  playPauseButton = "bigDropButton";
  spinnerStyling = "bigSpinner";
  playStopTitle = "DROP";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  isLoading = true;
  loadingSub: Subscription;
  mySavedSongsSubscription: Subscription;
  allCommentsSubscription: Subscription;
  dropStatesSub: Subscription;
  wasItHeartedSub: Subscription;
  mySongs: Song[] = [];
  mySavedSongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();

  whichAudioArray: string = "mySavedSongs";

  whichSongIsDropping: number;

  public YT: any;
  public video: any;
  public reframed: Boolean = false;

  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private songService: SongService,
    private uiHelperService: UiHelperService,
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.uid = window.localStorage.getItem("uid");
    this.whichSongIsDropping = this.songService.whichSongIsDropping;
    if (this.whichSongIsDropping >= 0) {
      this.dropStates[this.whichSongIsDropping] = true;
    }

    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.loadingSub = this.uiHelperService.mySavedSongsLoadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.mySavedSongsSubscription = this.songService.mySavedSongsListed.subscribe((songs) => {
      this.mySavedSongs = songs;
      this.init();
    });

    this.wasItHeartedSub = this.songService.wasItHeartedListed.subscribe((heartObject) => {
      var thisSong = this.mySavedSongs[heartObject.songIndex];
      thisSong.isHearted = heartObject.isHearted;
      thisSong.hearts = heartObject.hearts;
      thisSong.heartedBy = heartObject.heartedBy;
    });

    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });

    this.songService.fetchMySavedSongs(this.uid);
    this.commentService.fetchAllComments();
  }

  onHeartSong(hearts: number, heartedBy: string[], songId: string, index: number) {
    if (this.authService.isAuth)
      this.songService.heartSong(hearts, heartedBy, songId, this.uid, index, true);
    else
      this.uiHelperService.showSnackbar(
        "Login or Signup to save your favourite drops",
        "ok",
        10000
      );
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
  }

  onNextPage(hearts: number, name: string) {
    this.songService.nextPage(hearts, name, this.uid);
  }

  onPrevPage(hearts: number, name: string) {
    this.songService.prevPage(hearts, name, this.uid);
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
    if (this.mySavedSongsSubscription) this.mySavedSongsSubscription.unsubscribe();
    if (this.loadingSub) this.loadingSub.unsubscribe();
    if (this.allCommentsSubscription) this.allCommentsSubscription.unsubscribe();
    if (this.wasItHeartedSub) this.wasItHeartedSub.unsubscribe();
    if (this.dropStatesSub) this.dropStatesSub.unsubscribe();
  }
}
