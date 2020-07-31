import { Subscription } from "rxjs/subscription";
import { NgForm } from "@angular/forms";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Song } from "./song.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable()
export class SongService {
  private firebaseSub: Subscription;
  private mySongs: Song[] = [];
  private playingSong: Song;
  songPlaying = new Subject<Song>();
  mySongsChanged = new Subject<Song[]>();

  constructor(private db: AngularFirestore) {}
  getMySongs() {
    return this.mySongs.slice();
  }

  playSong(selectedId: String) {
    this.playingSong = this.mySongs.find((song) => song.id === selectedId);
    this.songPlaying.next({ ...this.playingSong });
  }

  uploadSong(form: NgForm) {
    this.dataToDatabase({
      name: form.value.songName,
      genre: form.value.genre,
    });
  }

  fetchSongs() {
    this.firebaseSub = this.db
      .collection("songs")
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          this.mySongs = songs;
          this.mySongsChanged.next([...this.mySongs]);
        },
        (error) => {}
      );
  }

  cancelSub() {
    this.firebaseSub.unsubscribe();
  }

  dataToDatabase(song: Song) {
    this.db.collection("songs").add(song);
  }
}
