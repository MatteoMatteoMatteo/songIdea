import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Song } from "./song.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import * as Tone from "tone";
import { Store } from "@ngrx/store";
import * as fromRoot from "./../app.reducer";
import * as AUDIO from "./../audio-player/audio.actions";

@Injectable()
export class SongService {
  uid: string;
  whichSongIsDropping: number;
  whichSongIsDroppingListed = new Subject<number>();
  private firebaseSub: Subscription;
  private mySongs: Song[] = [];
  private allSongs: Song[] = [];
  private songLoading: boolean[] = [];
  private dropState: boolean[] = [];
  mySongsListed = new Subject<Song[]>();
  allSongsListed = new Subject<Song[]>();
  songLoadingListed = new Subject<boolean[]>();
  dropStateListed = new Subject<boolean[]>();

  constructor(private db: AngularFirestore, private uiHelperService: UiHelperService) {}

  getMySongs() {
    return this.mySongs.slice();
  }

  dropSong(id: number) {
    if (id >= 0 && id < this.allSongs.length) {
      this.whichSongIsDropping = id;
      this.whichSongIsDroppingListed.next(this.whichSongIsDropping);
      if (this.allSongs[id].player.state === "stopped") {
        this.dropState.fill(false);
        this.dropStateListed.next([...this.dropState]);
        this.allSongs.forEach((song) => {
          song.player.stop();
        });
        if (this.allSongs[id].player.loaded === false) {
          this.songLoading[id] = true;
          this.songLoadingListed.next([...this.songLoading]);
          this.allSongs[id].player.load(this.allSongs[id].path).then(() => {
            this.allSongs[id].player.start();
            this.songLoading[id] = false;
            this.songLoadingListed.next([...this.songLoading]);
            this.dropState[id] = true;
            this.dropStateListed.next([...this.dropState]);
          });
        } else {
          this.allSongs[id].player.start();
          this.dropState[id] = true;
          this.dropStateListed.next([...this.dropState]);
        }
      } else {
        this.allSongs[id].player.stop();
        this.dropState[id] = false;
        this.dropStateListed.next([...this.dropState]);
      }
    }
  }

  uploadSong(songName: string, songGenre: string, url: string, uid: string) {
    this.songToDatabase({
      name: songName,
      genre: songGenre,
      userId: uid,
      path: url,
      date: new Date(),
    });
  }

  songToDatabase(song: Song) {
    this.db.collection("songs").add(song);
  }

  playSong(selectedId: String) {
    // this.db.doc("songs/" + selectedId).update({ lastPlayed: new Date() });
    // this.playingSong = this.mySongs.find((song) => song.songId === selectedId);
    // this.songPlaying.next({ ...this.playingSong });
  }

  deleteSong(selectedId: String) {
    this.db.doc("songs/" + selectedId).delete();
  }

  fetchAllSongs() {
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.firebaseSub = this.db
      .collection("songs", (ref) => ref.orderBy("name"))
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).toDestination(),
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          this.allSongs = songs;
          this.allSongsListed.next([...this.allSongs]);
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        }
      );
  }

  fetchMySongs(uid: string) {
    this.uiHelperService.loadingStateChanged.next(true);
    this.firebaseSub = this.db
      .collection("songs", (ref) => ref.where("userId", "==", uid))
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).toDestination(),
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          this.mySongs = songs;
          this.mySongsListed.next([...this.mySongs]);
          this.uiHelperService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.loadingStateChanged.next(false);
        }
      );
  }

  cancelSub() {
    this.firebaseSub.unsubscribe();
  }
}
