import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Song } from "./song.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable()
export class SongService {
  uid: string;
  private firebaseSub: Subscription;
  private mySongs: Song[] = [];
  private allSongs: Song[] = [];
  private playingSong: Song;
  songPlaying = new Subject<Song>();
  mySongsListed = new Subject<Song[]>();
  allSongsListed = new Subject<Song[]>();

  constructor(private db: AngularFirestore, private uiHelperService: UiHelperService) {}

  getMySongs() {
    return this.mySongs.slice();
  }

  uploadSong(songName: string, songGenre: string, url: string) {
    if (localStorage.hasOwnProperty("userId")) {
      this.uid = localStorage.getItem("userId");
    }
    this.songToDatabase({
      name: songName,
      genre: songGenre,
      userId: this.uid,
      path: url,
      date: new Date(),
    });
  }

  songToDatabase(song: Song) {
    this.db.collection("songs").add(song);
  }

  playSong(selectedId: String) {
    // this.db.doc("songs/" + selectedId).update({ lastPlayed: new Date() });
    this.playingSong = this.mySongs.find((song) => song.songId === selectedId);
    this.songPlaying.next({ ...this.playingSong });
  }

  deleteSong(selectedId: String) {
    this.db.doc("songs/" + selectedId).delete();
  }

  fetchAllSongs() {
    this.uiHelperService.loadingStateChanged.next(true);
    this.firebaseSub = this.db
      .collection("songs")
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          this.allSongs = songs;
          this.allSongsListed.next([...this.allSongs]);
          this.uiHelperService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.loadingStateChanged.next(false);
        }
      );
  }

  fetchMySongs() {
    this.uiHelperService.loadingStateChanged.next(true);
    this.firebaseSub = this.db
      .collection("songs", (ref) => ref.where("userId", "==", localStorage.getItem("userId")))
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
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
