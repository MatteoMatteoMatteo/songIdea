import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Song } from "./song.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import * as Tone from "tone";

@Injectable()
export class SongService {
  uid: string;
  whichSongIsDropping: number;
  newSongTimer: any;
  private mySongs: Song[] = [];
  public allSongs: Song[] = [];
  private songLoading: boolean[] = [];
  private dropState: boolean[] = [];
  mySongsListed = new Subject<Song[]>();
  allSongsListed = new Subject<Song[]>();
  songLoadingListed = new Subject<boolean[]>();
  dropStateListed = new Subject<boolean[]>();
  startCountdownListed = new Subject<number>();
  whichSongIsDroppingListed = new Subject<number>();
  destroyAudioPlayer = new Subject<boolean>();
  audioPlayingListed = new Subject<boolean>();
  private firebaseSub: Subscription;
  private moreSongsSub: Subscription;
  private mySongsSub: Subscription;

  countdownNumber: number;
  countdown: any;
  autoFilter = new Tone.AutoFilter({
    frequency: 0,
    baseFrequency: 30000,
    octaves: 0,
  });
  reverb = new Tone.Reverb({
    wet: 0,
    decay: 5,
  });

  constructor(private db: AngularFirestore, private uiHelperService: UiHelperService) {}

  stopAll() {
    clearInterval(this.countdown);
    clearTimeout(this.newSongTimer);
    this.allSongs.forEach((song) => {
      song.player.stop();
    });
    this.allSongs = [];
    this.destroyAudioPlayer.next(true);
  }

  dropSong(id: number) {
    if (id >= 0 && id < this.allSongs.length) {
      clearInterval(this.countdown);
      clearTimeout(this.newSongTimer);
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
            this.allSongs[id].player.start(null, null, 30);
            this.manageCountdown();
            this.manageNextSongAfterCountdown(id);
            this.songLoading[id] = false;
            this.songLoadingListed.next([...this.songLoading]);
            this.dropState[id] = true;
            this.dropStateListed.next([...this.dropState]);
            this.audioPlayingListed.next(true);
          });
        } else {
          this.allSongs[id].player.start(null, null, 30);
          this.manageCountdown();
          this.manageNextSongAfterCountdown(id);
          this.dropState[id] = true;
          this.dropStateListed.next([...this.dropState]);
          this.audioPlayingListed.next(true);
        }
      } else {
        clearInterval(this.countdown);
        clearTimeout(this.newSongTimer);
        this.countdownNumber = 30;
        this.allSongs[id].player.stop();
        this.dropState[id] = false;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(false);
      }
    } else {
      this.dropSong(0);
    }
  }

  manageCountdown() {
    clearInterval(this.countdown);
    this.countdownNumber = 30;
    this.countdown = setInterval(() => {
      if (this.countdownNumber === 0) {
        clearInterval(this.countdown);
      }
      this.countdownNumber--;
      this.startCountdownListed.next(this.countdownNumber);
    }, 1000);
  }

  manageNextSongAfterCountdown(id: number) {
    this.newSongTimer = setTimeout(() => {
      this.dropSong(id + 1);
    }, 30000);
  }

  changePitch(id: number, value: any) {
    this.allSongs[id].player.playbackRate = value;
  }
  changeVolume(id: number, val: any) {
    this.allSongs[id].player.volume.value = val;
  }
  changeFx1(id: number, val: any) {
    this.autoFilter.baseFrequency = val;
  }
  changeFx2(id: number, val: any) {
    this.reverb.wet.value = val;
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

  deleteSong(selectedId: String) {
    this.db.doc("songs/" + selectedId).delete();
  }

  fetchAllSongs() {
    this.destroyAudioPlayer.next(false);
    if (this.allSongs.length === 0) {
      this.db.collection("songs", (ref) => ref.orderBy("name"));
      this.uiHelperService.allSongsLoadingStateChanged.next(true);
      this.firebaseSub = this.db
        .collection("songs", (ref) => ref.orderBy("name").limit(3))
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                songId: doc.payload.doc.id,
                player: new Tone.Player({
                  url: "",
                  autostart: false,
                  fadeOut: 0.3,
                }).chain(this.reverb, this.autoFilter, Tone.Destination),
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
    } else {
      this.allSongsListed.next([...this.allSongs]);
    }
  }
  fetchMoreSongs(lastSongName: string) {
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.moreSongsSub = this.db
      .collection("songs", (ref) => ref.limit(3).orderBy("name").startAfter(lastSongName))
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
                fadeOut: 0.3,
              }).chain(this.reverb, this.autoFilter, Tone.Destination),
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          songs.forEach((el) => {
            this.allSongs.push(el);
          });
          console.log(this.allSongs);
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
    this.mySongsSub = this.db
      .collection("songs", (ref) => ref.where("userId", "==", uid))
      .snapshotChanges()
      .pipe(
        map((docs) => {
          return docs.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).connect(this.autoFilter),
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
    if (this.firebaseSub) this.firebaseSub.unsubscribe();
    if (this.mySongsSub) this.mySongsSub.unsubscribe();
    if (this.moreSongsSub) this.moreSongsSub.unsubscribe();
  }
}
