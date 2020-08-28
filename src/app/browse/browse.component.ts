import { CommentService } from "./../comments/comment.service";
import { PaginationService } from "./../infiniteScroll/pagination.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { SongService } from "./../songs/song.service";
import { Song } from "./../songs/song.model";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Comment } from "./../comments/comment.model";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent implements OnInit, OnDestroy {
  loadingSub: Subscription;
  isLoading: boolean;
  allSongsSubscription: Subscription;
  allSongs: Song[];
  randomSong: Song;
  buttonStyling = "bigDropButton";
  spinnerStyling = "bigSpinner";
  buttonTitle = "DROP";
  songsLoading: boolean[] = [];
  songsLoadingSub: Subscription;
  dropStates: boolean[] = [];
  dropStatesSub: Subscription;
  whichSongIsDropping: number;
  allCommentsSubscription: Subscription;
  allComments: Comment[] = [];
  constructor(
    public page: PaginationService,
    private songService: SongService,
    private uiHelperService: UiHelperService,
    private commentService: CommentService
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
    this.loadingSub = this.uiHelperService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
  }

  ngOnDestroy() {
    if (this.allSongsSubscription) {
      this.allSongsSubscription.unsubscribe();
    }
    this.loadingSub.unsubscribe();
  }
}
