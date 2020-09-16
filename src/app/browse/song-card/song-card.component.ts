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
  isLoading: boolean;
  uid: string;
  whichSongIsDropping: number;
  lastSongName: string;
  allSongs: Song[];
  allComments: Comment[] = [];
  buttonStyling = "bigDropButton";
  spinnerStyling = "bigSpinner";
  buttonTitle = "DROP";
  songsLoading: boolean[] = [];
  dropStates: boolean[] = [];
  songsLoadingSub: Subscription;
  dropStatesSub: Subscription;
  allCommentsSubscription: Subscription;
  allSongsSubscription: Subscription;
  loadingSub: Subscription;

  public YT: any;
  public video: any;
  private player: any;
  public reframed: Boolean = false;
  youtube: any;

  constructor(
    private commentService: CommentService,
    private songService: SongService,
    private store: Store<fromRoot.State>,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit(): void {
    this.whichSongIsDropping = this.songService.whichSongIsDropping;
    if (this.whichSongIsDropping >= 0) {
      this.dropStates[this.whichSongIsDropping] = true;
    }
    this.dropStatesSub = this.songService.dropStateListed.subscribe((dropStates) => {
      this.dropStates = dropStates;
    });
    this.songsLoadingSub = this.songService.songLoadingListed.subscribe((songsLoading) => {
      this.songsLoading = songsLoading;
    });
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.allSongsSubscription = this.songService.allSongsListed.subscribe((songs) => {
      this.allSongs = songs;
      this.init();
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
    });
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.songService.fetchAllSongs();
    this.commentService.fetchAllComments();
  }

  dropSong(id: number) {
    this.songService.dropSong(id);
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
  }

  onLoadMoreSongs(name: string) {
    this.songService.fetchMoreSongs(name);
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
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => this.startVideo();
  }

  lol(id: number) {
    this.allSongs.forEach((song) => {
      song.playerHolder.pauseVideo();
    });
    this.allSongs[id].playerHolder.playVideo();
  }

  startVideo() {
    console.log(this.allSongs);
    this.reframed = false;
    this.allSongs.forEach((song) => {
      song.playerHolder = new window["YT"].Player(song.playerId, {
        videoId: song.videoId,
        width: 300,
        height: 200,
        playerVars: {
          start: 40,
          end: 65,
          autoplay: 0,
          modestbranding: 0,
          controls: 0,
          disablekb: 0,
          rel: 0,
          showinfo: 0,
          fs: 0,
          playsinline: 0,
        },
        events: {},
      });
    });
  }
}
