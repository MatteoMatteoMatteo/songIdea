import { UploadComponent } from "./../upload/upload.component";
import { Heart } from "./heart.model";
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
  howManySongsFetched: number = 10;
  howManyUploadsFetched: number = 5;
  item = [
    this.db.collection("songs", (ref) =>
      ref.orderBy("name", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("date", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("videoId", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("dropTime", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("genre", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("hearts", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("url", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("userId", "desc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("name", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("videoId", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("dropTime", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("genre", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("hearts", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) =>
      ref.orderBy("date", "asc").limit(this.howManySongsFetched)
    ),
    this.db.collection("songs", (ref) => ref.orderBy("url", "asc").limit(this.howManySongsFetched)),
    this.db.collection("songs", (ref) =>
      ref.orderBy("userId", "asc").limit(this.howManySongsFetched)
    ),
  ];
  heartOperation = false;
  uid: string;
  whichSongIsDropping: number;
  newSongTimer: any;
  private moreAllSongs: Song[] = [];
  private myUploadedSongs: Song[] = [];
  public mySavedSongs: Song[] = [];
  public allSongs: Song[] = [];
  wasItHearted: boolean;
  private songLoading: boolean[] = [];
  private dropState: boolean[] = [];
  myUploadedSongsListed = new Subject<Song[]>();
  mySavedSongsListed = new Subject<Song[]>();
  allSongsListed = new Subject<Song[]>();
  sendSongsAgainListed = new Subject<Song[]>();
  allMyUploadHeartsListed = new Subject<Song[]>();
  songLoadingListed = new Subject<boolean[]>();
  dropStateListed = new Subject<boolean[]>();
  wasItHeartedListed = new Subject<any>();
  startCountdownListed = new Subject<number>();
  whichSongIsDroppingListed = new Subject<number>();
  destroyAudioPlayer = new Subject<boolean>();
  audioPlayingListed = new Subject<boolean>();

  justALittleDelay = new Subject<boolean>();

  hideAudioPlayer = true;
  hideAudioPlayerListed = new Subject<boolean>();

  private firebaseSub: Subscription;
  private moreSongsSub: Subscription;
  private mySongsSub: Subscription;
  private heartsSub: Subscription;
  private mySavedSongsSub: Subscription;

  endOfPage: boolean;

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
    if (this.allSongs) {
      this.allSongs.forEach((song) => {
        song.player.stop();
      });
    }
    this.allSongs = [];
    this.destroyAudioPlayer.next(true);
  }

  clearAllTimers() {
    clearInterval(this.countdown);
    clearTimeout(this.newSongTimer);
    this.countdown = 30;
  }

  stopAllVideo() {
    clearInterval(this.countdown);
    clearTimeout(this.newSongTimer);

    if (this.allSongs.length != 0) {
      this.allSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
    }
    if (this.mySavedSongs.length != 0) {
      this.mySavedSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
    }
    if (this.myUploadedSongs.length != 0) {
      this.myUploadedSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
    }
  }

  dropSong(id: number) {
    if (id >= 0 && id < this.allSongs.length) {
      if (this.hideAudioPlayer) {
        this.hideAudioPlayerListed.next(false);
        this.hideAudioPlayer = false;
      }
      clearInterval(this.countdown);
      clearTimeout(this.newSongTimer);
      this.whichSongIsDropping = id;
      this.whichSongIsDroppingListed.next(this.whichSongIsDropping);
      if (this.allSongs[id].playerHolder.getPlayerState() != 1) {
        this.dropState.fill(false);
        this.dropStateListed.next([...this.dropState]);
        this.allSongs.forEach((song) => {
          song.playerHolder.pauseVideo();
        });
        this.allSongs[id].playerHolder.unMute();
        this.allSongs[id].playerHolder.seekTo(this.allSongs[id].dropTime, true);
        this.allSongs[id].playerHolder.playVideo();
        this.manageCountdown();
        this.manageNextSongAfterCountdown(id, "allSongs");
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

  dropMySavedSong(id: number) {
    if (id >= 0 && id < this.mySavedSongs.length) {
      if (this.hideAudioPlayer) {
        this.hideAudioPlayerListed.next(false);
        this.hideAudioPlayer = false;
      }
      clearInterval(this.countdown);
      clearTimeout(this.newSongTimer);
      this.whichSongIsDropping = id;
      this.whichSongIsDroppingListed.next(this.whichSongIsDropping);
      if (this.mySavedSongs[id].playerHolder.getPlayerState() != 1) {
        this.dropState.fill(false);
        this.dropStateListed.next([...this.dropState]);
        this.mySavedSongs.forEach((song) => {
          song.playerHolder.pauseVideo();
        });
        this.mySavedSongs[id].playerHolder.unMute();
        this.mySavedSongs[id].playerHolder.seekTo(this.mySavedSongs[id].dropTime, true);
        this.mySavedSongs[id].playerHolder.playVideo();
        this.manageCountdown();
        this.manageNextSongAfterCountdown(id, "mySavedSongs");
        this.dropState[id] = true;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(true);
      } else {
        clearInterval(this.countdown);
        clearTimeout(this.newSongTimer);
        this.countdownNumber = 30;
        this.mySavedSongs[id].playerHolder.pauseVideo();
        this.dropState[id] = false;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(false);
      }
    } else {
      this.dropMySavedSong(0);
    }
  }

  dropMyUploadedSong(id: number) {
    if (id >= 0 && id < this.myUploadedSongs.length) {
      if (this.hideAudioPlayer) {
        this.hideAudioPlayerListed.next(false);
        this.hideAudioPlayer = false;
      }
      clearInterval(this.countdown);
      clearTimeout(this.newSongTimer);
      this.whichSongIsDropping = id;
      this.whichSongIsDroppingListed.next(this.whichSongIsDropping);
      if (this.myUploadedSongs[id].playerHolder.getPlayerState() != 1) {
        this.dropState.fill(false);
        this.dropStateListed.next([...this.dropState]);
        this.myUploadedSongs.forEach((song) => {
          song.playerHolder.pauseVideo();
        });
        this.myUploadedSongs[id].playerHolder.unMute();
        this.myUploadedSongs[id].playerHolder.seekTo(this.myUploadedSongs[id].dropTime, true);
        this.myUploadedSongs[id].playerHolder.playVideo();
        this.manageCountdown();
        this.manageNextSongAfterCountdown(id, "myUploadedSongs");
        this.dropState[id] = true;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(true);
      } else {
        clearInterval(this.countdown);
        clearTimeout(this.newSongTimer);
        this.countdownNumber = 30;
        this.myUploadedSongs[id].playerHolder.pauseVideo();
        this.dropState[id] = false;
        this.dropStateListed.next([...this.dropState]);
        this.audioPlayingListed.next(false);
      }
    } else {
      this.dropMyUploadedSong(0);
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

  manageNextSongAfterCountdown(id: number, whichSongs: string) {
    var nextId = id + 1;
    this.newSongTimer = setTimeout(() => {
      if (whichSongs == "allSongs") {
        this.dropSong(nextId);
      } else if (whichSongs == "mySavedSongs") {
        this.dropMySavedSong(nextId);
      } else if (whichSongs == "myUploadedSongs") {
        this.dropMyUploadedSong(nextId);
      }
    }, 30000);
  }

  changePitch(id: number, value: any, whichSongs: string) {
    if (whichSongs === "allSongs") {
      this.allSongs[id].playerHolder.setPlaybackRate(value);
    } else if (whichSongs === "mySavedSongs") {
      this.mySavedSongs[id].playerHolder.setPlaybackRate(value);
    } else if (whichSongs === "myUploadedSongs") {
      this.myUploadedSongs[id].playerHolder.setPlaybackRate(value);
    }
  }
  changeVolume(id: number, value: any, whichSongs: string) {
    if (whichSongs === "allSongs") {
      this.allSongs[id].playerHolder.setVolume(value);
    } else if (whichSongs === "mySavedSongs") {
      this.mySavedSongs[id].playerHolder.setVolume(value);
    } else if (whichSongs === "myUploadedSongs") {
      this.myUploadedSongs[id].playerHolder.setVolume(value);
    }
  }
  changeFx1(id: number, value: any) {
    this.autoFilter.baseFrequency = value;
  }
  changeFx2(id: number, value: any) {
    this.reverb.wet.value = value;
  }

  uploadSong(
    songName: string,
    songGenre: string,
    videoId: string,
    uid: string,
    url: string,
    dropTime: number
  ) {
    this.songToDatabase({
      name: songName,
      genre: songGenre,
      videoId: videoId,
      userId: uid,
      hearts: 10,
      heartedBy: [uid],
      date: new Date(),
      url: url,
      dropTime,
    });
  }

  songToDatabase(song: Song) {
    this.db
      .collection("songs")
      .add(song)
      .then(() => {
        setTimeout(() => {
          this.uiHelperService.uploadSongListed.next(false);
        }, 850);
      });
  }

  heartSong(
    hearts: number,
    heartedBy: string[],
    songId: string,
    uid: string,
    i: number,
    mySavedSongsRemoval?: boolean
  ) {
    this.heartOperation = true;
    var heartObject: any;
    var newHeartsPlus = hearts + 1;
    var newHeartsMinus = hearts - 1;
    if (hearts > 0) {
      newHeartsMinus = hearts - 1;
    } else {
      newHeartsMinus = 0;
    }
    if (!heartedBy.includes(uid)) {
      heartedBy.push(uid);
      heartObject = { isHearted: true, heartedBy: heartedBy, hearts: newHeartsPlus, songIndex: i };
      this.wasItHeartedListed.next(heartObject);
      this.db
        .doc(`songs/${songId}`)
        .update({ hearts: newHeartsPlus, heartedBy: heartedBy })
        .then(() => {
          this.heartOperation = false;
        });
    } else {
      const index = heartedBy.indexOf(uid);
      if (index > -1) {
        heartedBy.splice(index, 1);
      }
      heartObject = {
        isHearted: false,
        heartedBy: heartedBy,
        hearts: newHeartsMinus,
        songIndex: i,
      };
      this.wasItHeartedListed.next(heartObject);
      this.db
        .doc(`songs/${songId}`)
        .update({ hearts: newHeartsMinus, heartedBy: heartedBy })
        .then(() => {
          this.heartOperation = false;
        });
    }
  }

  checkIfHearted(songs: Song[], uid: string) {
    songs.forEach((el) => {
      if (el.heartedBy.includes(uid)) {
        el.isHearted = true;
      } else {
        el.isHearted = false;
      }
    });
    this.allSongs = songs;
    this.uiHelperService.allSongsLoadingStateChanged.next(false);
    return this.allSongs;
  }

  checkIfHeartedMySavedSong(songs: Song[], uid: string) {
    songs.forEach((el) => {
      if (el.heartedBy.includes(uid)) {
        el.isHearted = true;
      } else {
        el.isHearted = false;
      }
    });
    this.mySavedSongs = songs;
    this.uiHelperService.mySavedSongsLoadingStateChanged.next(false);
    return this.mySavedSongs;
  }

  deleteSong(songId: string, heartDocId: string) {
    this.db.doc("songs/" + songId).delete();
    this.db.doc("hearts/" + heartDocId).delete();
  }

  makeid(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //-----------------Browse
  fetchAllSongs(uid: string) {
    this.hideAudioPlayerListed.next(true);
    this.clearAllTimers();
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    var item = this.item[Math.floor(Math.random() * this.item.length)];
    this.uid = uid;
    this.destroyAudioPlayer.next(false);
    this.firebaseSub = item
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          if (docArray.length == 0) {
            this.endOfPage = true;
          }
          return docArray.map((doc) => {
            return {
              isLoading: true,
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
                fadeOut: 0.3,
              }).chain(this.reverb, this.autoFilter, Tone.Destination),
              playerHolder: null,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          console.log(songs);
          if (!this.heartOperation) {
            this.allSongsListed.next([...this.checkIfHearted(songs, this.uid)]);

            this.endOfPage = false;
          }
        },
        (error) => {}
      );
  }

  loadMoreDrops(hearts: number, name: string) {
    this.clearAllTimers();
    var item = this.item[Math.floor(Math.random() * this.item.length)];
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.moreSongsSub = item
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          if (docArray.length == 0) {
            this.endOfPage = true;
          }
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              playerHolder: null,
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
      .subscribe((songs: Song[]) => {
        if (!this.heartOperation && !this.endOfPage) {
          setTimeout(() => {
            this.allSongsListed.next([...this.checkIfHearted(songs, this.uid)]);
          }, 500);
        }
        this.endOfPage = false;
      });
  }

  //---------------My Saved Songs
  fetchMySavedSongs(uid: string) {
    this.uid = uid;
    this.hideAudioPlayerListed.next(true);
    this.clearAllTimers();
    this.uiHelperService.mySavedSongsLoadingStateChanged.next(true);
    this.mySavedSongsSub = this.db
      .collection("songs", (ref) =>
        ref
          .orderBy("name", "asc")
          .where("heartedBy", "array-contains", uid)
          .limit(this.howManySongsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docs) => {
          if (docs.length == 0) {
            this.endOfPage = true;
          }
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
      .subscribe((songs: Song[]) => {
        if (!this.heartOperation) {
          this.mySavedSongsListed.next([...this.checkIfHeartedMySavedSong(songs, this.uid)]);
        }
        this.endOfPage = false;
      });
  }

  nextPage(hearts: number, name: string, uid: string) {
    this.clearAllTimers();
    this.moreSongsSub = this.db
      .collection("songs", (ref) =>
        ref
          .orderBy("name", "asc")
          .where("heartedBy", "array-contains", uid)
          .startAfter(name)
          .limit(this.howManySongsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          if (docArray.length == 0) {
            this.endOfPage = true;
            this.uiHelperService.showSnackbar(
              "You have listened to all your saved songs!",
              "ok",
              3000
            );
          } else {
            this.uiHelperService.mySavedSongsLoadingStateChanged.next(true);
          }
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              playerHolder: null,
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
      .subscribe((songs: Song[]) => {
        if (!this.heartOperation && !this.endOfPage) {
          this.mySavedSongsListed.next([...this.checkIfHeartedMySavedSong(songs, this.uid)]);
        } else if (!this.heartOperation && this.endOfPage) {
          this.uiHelperService.mySavedSongsLoadingStateChanged.next(false);
        } else {
        }
        this.endOfPage = false;
      });
  }

  prevPage(hearts: number, name: string, uid: string) {
    this.clearAllTimers();
    this.moreSongsSub = this.db
      .collection("songs", (ref) =>
        ref
          .orderBy("name", "asc")
          .where("heartedBy", "array-contains", uid)
          .endBefore(name)
          .limitToLast(this.howManySongsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          if (docArray.length == 0) {
            this.endOfPage = true;
            this.uiHelperService.showSnackbar("There are no previous songs yet!", "ok", 3000);
          } else {
            this.uiHelperService.mySavedSongsLoadingStateChanged.next(true);
          }
          return docArray.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              playerHolder: null,
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
      .subscribe((songs: Song[]) => {
        if (!this.heartOperation && !this.endOfPage) {
          this.mySavedSongsListed.next([...this.checkIfHeartedMySavedSong(songs, this.uid)]);
        } else if (!this.heartOperation && this.endOfPage) {
          this.uiHelperService.mySavedSongsLoadingStateChanged.next(false);
        } else {
        }
        this.endOfPage = false;
      });
  }

  //----------------My Uploads
  fetchMyUploads(uid: string) {
    this.clearAllTimers();
    this.uiHelperService.loadingStateChanged.next(true);
    this.mySongsSub = this.db
      .collection("songs", (ref) =>
        ref.orderBy("date", "desc").where("userId", "==", uid).limit(this.howManyUploadsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docs) => {
          if (docs.length == 0) {
            this.endOfPage = true;
          }
          return docs.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).connect(this.autoFilter),
              playerHolder: null,
              isHearted: null,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe((songs: Song[]) => {
        this.myUploadedSongs = songs;
        this.myUploadedSongsListed.next([...this.myUploadedSongs]);
        this.uiHelperService.loadingStateChanged.next(false);
      });
  }

  myUploadsNext(uid: string, name: string, date: any) {
    this.clearAllTimers();
    this.mySongsSub = this.db
      .collection("songs", (ref) =>
        ref
          .orderBy("date", "desc")
          .where("userId", "==", uid)
          .startAfter(date)
          .limit(this.howManyUploadsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docs) => {
          if (docs.length == 0) {
            this.endOfPage = true;
            this.uiHelperService.showSnackbar("That's all your uploads!", "ok", 3000);
          } else {
            this.uiHelperService.loadingStateChanged.next(true);
          }
          return docs.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).connect(this.autoFilter),
              playerHolder: null,
              isHearted: null,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe((songs: Song[]) => {
        if (!this.endOfPage) {
          this.myUploadedSongs = songs;
          this.myUploadedSongsListed.next([...this.myUploadedSongs]);
          this.uiHelperService.loadingStateChanged.next(false);
        } else if (this.endOfPage) {
          this.uiHelperService.loadingStateChanged.next(false);
        } else {
          this.uiHelperService.loadingStateChanged.next(false);
        }
        this.endOfPage = false;
      });
  }

  myUploadsPrevious(uid: string, name: string, date: any) {
    this.clearAllTimers();
    this.mySongsSub = this.db
      .collection("songs", (ref) =>
        ref
          .orderBy("date", "desc")
          .where("userId", "==", uid)
          .endBefore(date)
          .limitToLast(this.howManyUploadsFetched)
      )
      .snapshotChanges()
      .pipe(
        map((docs) => {
          if (docs.length == 0) {
            this.endOfPage = true;
            this.uiHelperService.showSnackbar("There are no previous songs yet!", "ok", 3000);
          } else {
            this.uiHelperService.loadingStateChanged.next(true);
          }
          return docs.map((doc) => {
            return {
              songId: doc.payload.doc.id,
              player: new Tone.Player({
                url: "",
                autostart: false,
              }).connect(this.autoFilter),
              playerHolder: null,
              isHearted: null,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe((songs: Song[]) => {
        if (!this.endOfPage) {
          this.myUploadedSongs = songs;
          this.myUploadedSongsListed.next([...this.myUploadedSongs]);
          this.uiHelperService.loadingStateChanged.next(false);
        } else if (this.endOfPage) {
          this.uiHelperService.loadingStateChanged.next(false);
        } else {
          this.uiHelperService.loadingStateChanged.next(false);
        }
        this.endOfPage = false;
      });
  }

  cancelSub() {
    if (this.firebaseSub) this.firebaseSub.unsubscribe();
    if (this.mySongsSub) this.mySongsSub.unsubscribe();
    if (this.moreSongsSub) this.moreSongsSub.unsubscribe();
    if (this.heartsSub) this.heartsSub.unsubscribe();
  }
}
