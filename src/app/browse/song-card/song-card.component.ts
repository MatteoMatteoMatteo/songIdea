import { AuthService } from "./../../auth/auth-service";
import { AngularFireAuth } from "@angular/fire/auth";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { SongService } from "./../../songs/song.service";
import { Subscription } from "rxjs";
import { CommentService } from "./../../comments/comment.service";
import { NgForm } from "@angular/forms";
import { Song } from "./../../songs/song.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Comment } from "../../comments/comment.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-song-card",
  templateUrl: "./song-card.component.html",
  styleUrls: ["./song-card.component.scss"],
})
export class SongCardComponent implements OnInit, OnDestroy {
  wasYoutubeTriggered = false;
  smallPitchButton = "smallPitchButton";
  playPauseButton = "bigDropButton";
  spinnerStyling = "bigSpinner";
  playStopTitle = "DROP";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  hearted: boolean;
  isLoading: boolean;
  uid: string;
  whichSongIsDropping: number;
  lastSongName: string;
  allSongs: Song[] = [];
  allHearts: Song[] = [];
  allComments: Comment[] = [];
  buttonTitle = "DROP";
  songsLoadingSub: Subscription;
  dropStatesSub: Subscription;
  allCommentsSubscription: Subscription;
  allSongsSubscription: Subscription;
  getSongsAgainSub: Subscription;
  loadingSub: Subscription;
  wasItHeartedSub: Subscription;

  constructor(
    private commentService: CommentService,
    private songService: SongService,
    private store: Store<fromRoot.State>,
    private uiHelperService: UiHelperService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.whichSongIsDropping = this.songService.whichSongIsDropping;
    if (this.whichSongIsDropping >= 0) {
      this.dropStates[this.whichSongIsDropping] = true;
    }
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });

    this.songService.wasYoutubeTriggeredListed.subscribe((bool) => {
      this.wasYoutubeTriggered = bool;
    });

    this.songsLoadingSub = this.songService.songLoadingListed.subscribe((songsLoading) => {
      this.songsLoading = songsLoading;
    });
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.allSongsSubscription = this.songService.allSongsListed.subscribe((songs) => {
      songs.forEach((song) => {
        this.allSongs.push(song);
      });
      this.init();
    });
    this.songService.moreSongsListed.subscribe((songs) => {
      songs.forEach((song) => {
        this.allSongs.push(song);
        console.log(this.allSongs);
      });
      this.init();
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
    });
    this.wasItHeartedSub = this.songService.wasItHeartedListed.subscribe((heartObject) => {
      var thisSong = this.allSongs[heartObject.songIndex];
      thisSong.isHearted = heartObject.isHearted;
      thisSong.hearts = heartObject.hearts;
      thisSong.heartedBy = heartObject.heartedBy;
    });
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.songService.fetchAllSongs(this.uid);
    this.commentService.fetchAllComments();
  }

  dropSong(id: number) {
    this.songService.dropSong(id);
  }

  onHeartSong(hearts: number, heartedBy: string[], songId: string, index: number) {
    if (this.authService.isAuth)
      this.songService.heartSong(hearts, heartedBy, songId, this.uid, index);
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

  onLoadMoreSongs(hearts: number) {
    this.songService.fetchMoreSongs(hearts);
  }

  onAddComment(form: NgForm, songId: string, uid: string) {
    this.commentService.addComment(form, songId, uid);
  }

  ngOnDestroy() {
    this.songsLoadingSub.unsubscribe();
    this.allCommentsSubscription.unsubscribe();
    this.dropStatesSub.unsubscribe();
    this.allSongsSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
  }

  init() {
    // if (window["YT"]) {
    //   window["YT"] = null;
    // }
    var tag = document.createElement("script");
    tag.id = "iframe-demo";
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => this.startVideo();
  }

  startVideo() {
    this.allSongs.forEach((song) => {
      if (song.playerHolder == null) {
        song.playerHolder = new window["YT"].Player(song.videoId, {
          playerVars: {
            autoplay: 0,
            enablejsapi: 1,
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
        console.log(song.playerHolder);
      }
    });
  }

  eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent("on" + etype);
    } else {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  onPlayerStateChange(event) {
    if (event.target.getPlayerState() == 1 && !this.wasYoutubeTriggered) {
      this.songService.wasYoutubeTriggeredListed.next(true);
      this.eventFire(document.getElementById("drop"), "click");
    }
  }

  onPlayerReady(event) {
    event.target.seekTo(130);
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }
}
