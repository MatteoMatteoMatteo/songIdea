import { AngularFirestore } from "@angular/fire/firestore";
import { CommentService } from "./../../comments/comment.service";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { CancelComponent } from "./../../uiHelper/cancel/cancel.component";
import { SongService } from "./../song.service";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Song } from "../song.model";
import { Subject } from "rxjs";
import { Comment } from "./../../comments/comment.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as AUDIO from "./../../audio-player/audio.actions";
import * as Tone from "tone";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-my-songs",
  templateUrl: "./my-songs.component.html",
  styleUrls: ["./my-songs.component.scss"],
})
export class MySongsComponent implements OnInit, OnDestroy {
  songLoading: boolean[] = [];
  dropState: boolean[] = [];
  toneSounds: Tone.Player[] = [];
  loadingSub: Subscription;
  isLoading: boolean;
  mySongSubscription: Subscription;
  allSongsSubscription: Subscription;
  allCommentsSubscription: Subscription;
  allPlayersSubscription: Subscription;
  mySongs: Song[] = [];
  allComments: Comment[] = [];
  @Output() exit = new EventEmitter();
  constructor(
    private storage: AngularFireStorage,
    private angularFireAuth: AngularFireAuth,
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
    this.allPlayersSubscription = this.songService.allPlayersListed.subscribe((players) => {
      this.toneSounds = players;
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

  dropSong(id: number) {
    if (this.toneSounds[id].state === "stopped") {
      this.toneSounds.forEach((song) => {
        song.stop();
      });
      if (this.toneSounds[id].loaded === false) {
        this.songLoading[id] = true;
        this.toneSounds[id].load(this.mySongs[id].path).then((song) => {
          this.songLoading[id] = false;
          song.start();
          this.dropState[id] = true;
        });
      } else {
        this.toneSounds[id].start();
        this.dropState[id] = true;
      }
    } else {
      this.toneSounds[id].stop();
      this.dropState[id] = false;
    }
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
