import { Heart } from "./heart.model";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Song } from "./song.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import * as Tone from "tone";
import { searchArray } from "./../../utilities/searchFunction.js";

@Injectable()
export class SongService {
  howManySongsFetched: number = 2;
  uid: string;
  whichSongIsDropping: number;
  newSongTimer: any;
  private mySongs: Song[] = [];
  private mySavedSongs: Song[] = [];
  public allSongs: Song[] = [];
  private allHearts: Heart[] = [];
  wasItHearted: any[];
  private songLoading: boolean[] = [];
  private dropState: boolean[] = [];
  mySongsListed = new Subject<Song[]>();
  mySavedSongsListed = new Subject<Song[]>();
  allSongsListed = new Subject<Song[]>();
  allHeartsListed = new Subject<Song[]>();
  songLoadingListed = new Subject<boolean[]>();
  dropStateListed = new Subject<boolean[]>();
  wasItHeartedListed = new Subject<boolean>();
  startCountdownListed = new Subject<number>();
  whichSongIsDroppingListed = new Subject<number>();
  destroyAudioPlayer = new Subject<boolean>();
  audioPlayingListed = new Subject<boolean>();
  private firebaseSub: Subscription;
  private moreSongsSub: Subscription;
  private mySongsSub: Subscription;
  private heartsSub: Subscription;
  private mySavedSongsSub: Subscription;

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
      if (
        this.allSongs[id].playerHolder.getPlayerState() == 2 ||
        this.allSongs[id].playerHolder.getPlayerState() == 5 ||
        this.allSongs[id].playerHolder.getPlayerState() == 0
      ) {
        this.dropState.fill(false);
        this.dropStateListed.next([...this.dropState]);
        this.allSongs.forEach((song) => {
          song.playerHolder.pauseVideo();
        });
        this.allSongs[id].playerHolder.seekTo(20, true);
        this.allSongs[id].playerHolder.playVideo();
        this.manageCountdown();
        this.manageNextSongAfterCountdown(id);
        this.dropState[id] = true;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(true);
      } else {
        clearInterval(this.countdown);
        clearTimeout(this.newSongTimer);
        this.countdownNumber = 30;
        this.allSongs[id].playerHolder.pauseVideo();
        this.dropState[id] = false;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(false);
      }
    } else {
      this.dropSong(0);
    }
  }

  dropSongOld(id: number) {
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
          this.allSongs[id].player.start(null, null, 30);
          this.manageCountdown();
          this.manageNextSongAfterCountdown(id);
          this.songLoading[id] = false;
          this.songLoadingListed.next([...this.songLoading]);
          this.dropState[id] = true;
          this.dropStateListed.next([...this.dropState]);
          this.audioPlayingListed.next(true);
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
      this.dropSongOld(0);
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

  uploadSong(songName: string, songGenre: string, videoId: string, uid: string) {
    this.songToDatabase({
      name: songName,
      genre: songGenre,
      videoId: videoId,
      userId: uid,
      date: new Date(),
    });
    this.heartToDatabase({
      name: songName,
      hearts: 0,
      heartedBy: [],
      videoId: videoId,
      userId: uid,
    });
  }

  songToDatabase(song: Song) {
    this.db.collection("songs").add(song);
  }

  heartToDatabase(heart: Heart) {
    this.db.collection("hearts").add(heart);
  }

  heartSong(heartDocId: string, hearts: number, uid: string, videoId: string, i: number) {
    var resultObject = searchArray(videoId, this.allHearts);
    var newHeartsMinus: number;
    var newHeartsPlus = hearts + 1;
    if (hearts > 0) {
      newHeartsMinus = hearts - 1;
    } else {
      newHeartsMinus = 0;
    }
    if (!resultObject.heartedBy.includes(uid)) {
      resultObject.heartedBy.push(uid);
      this.wasItHearted[i] = true;
      this.db
        .doc(`hearts/${heartDocId}`)
        .update({ hearts: newHeartsPlus, heartedBy: resultObject.heartedBy });
    } else {
      const index = resultObject.heartedBy.indexOf(uid);
      if (index > -1) {
        resultObject.heartedBy.splice(index, 1);
      }
      this.wasItHearted[i] = false;
      this.db
        .doc(`hearts/${heartDocId}`)
        .update({ hearts: newHeartsMinus, heartedBy: resultObject.heartedBy });
    }
  }

  checkIfHearted(uid: string) {
    this.allHearts.forEach((el) => {
      if (el.heartedBy.includes(uid)) {
        this.wasItHearted.push(true);
      } else {
        this.wasItHearted.push(false);
      }
    });
  }

  deleteSong(selectedId: String) {
    this.db.doc("songs/" + selectedId).delete();
  }

  doIt() {
    window["onYouTubeIframeAPIReady"] = () => this.fetchAllSongs();
  }
  fetchHearts(uid: string) {
    this.uid = uid;
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.heartsSub = this.db
      .collection("hearts", (ref) => ref.orderBy("name").limit(this.howManySongsFetched))
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              heartDocId: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Heart),
            };
          });
        })
      )
      .subscribe(
        (hearts: Heart[]) => {
          this.allHearts = hearts;
          if (typeof this.wasItHearted == "undefined") {
            this.wasItHearted = [];
            this.checkIfHearted(this.uid);
          }
          for (var i = 0; i < this.allSongs.length; i++) {
            this.allSongs[i].hearts = this.allHearts[i].hearts;
            this.allSongs[i].heartedBy = this.allHearts[i].heartedBy;
            this.allSongs[i].heartDocId = this.allHearts[i].heartDocId;
            this.allSongs[i].isHearted = this.wasItHearted[i];
          }
          this.allHeartsListed.next([...this.allSongs]);
          console.log(this.allSongs);
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        }
      );
  }
  fetchAllSongs() {
    this.destroyAudioPlayer.next(false);
    this.db.collection("songs", (ref) => ref.orderBy("name"));
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.firebaseSub = this.db
      .collection("songs", (ref) => ref.orderBy("name").limit(this.howManySongsFetched))
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
              playerHolder: null,
              isHearted: null,
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
  fetchMoreSongs(lastSongName: string) {
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.moreSongsSub = this.db
      .collection("songs", (ref) =>
        ref.limit(this.howManySongsFetched).orderBy("name").startAfter(lastSongName)
      )
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

  fetchMySavedSongs(uid: string) {
    this.uiHelperService.loadingStateChanged.next(true);
    this.mySavedSongsSub = this.db
      .collection("songs", (ref) => ref.where("heartedBy", "array-contains", uid))
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
          this.mySavedSongs = songs;
          this.mySavedSongsListed.next([...this.mySavedSongs]);
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
    if (this.heartsSub) this.heartsSub.unsubscribe();
  }
}
