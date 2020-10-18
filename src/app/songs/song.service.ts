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
  howManySongsFetched: number = 6;
  item = [
    this.db.collection("songs", (ref) =>
      ref.orderBy("name", "desc").limit(this.howManySongsFetched)
    ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("videId", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("dropTime", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("genre", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("hearts", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("url", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("userId", "desc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("name", "asc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("videId", "asc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("dropTime", "asc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("genre", "asc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("hearts", "asc").limit(this.howManySongsFetched)
    // ),
    // this.db.collection("songs", (ref) => ref.orderBy("url", "asc").limit(this.howManySongsFetched)),
    // this.db.collection("songs", (ref) =>
    //   ref.orderBy("userId", "asc").limit(this.howManySongsFetched)
    // ),
  ];
  heartOperation = false;
  uid: string;
  whichSongIsDropping: number;
  newSongTimer: any;
  private moreAllSongs: Song[] = [];
  private myUploadedSongs: Song[] = [];
  private mySavedSongs: Song[] = [];
  public allSongs: Song[];
  wasItHearted: boolean;
  private songLoading: boolean[] = [];
  private dropState: boolean[] = [];
  mySongsListed = new Subject<Song[]>();
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
    if (this.allSongs) {
      this.allSongs.forEach((song) => {
        song.player.stop();
      });
    }
    this.allSongs = [];
    this.destroyAudioPlayer.next(true);
  }

  stopAllVideo() {
    clearInterval(this.countdown);
    clearTimeout(this.newSongTimer);
    this.countdown = 30;
    if (this.allSongs) {
      this.allSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
      this.allSongs = [];
    }
    if (this.mySavedSongs) {
      this.mySavedSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
      this.mySavedSongs = [];
    }
    if (this.myUploadedSongs) {
      this.myUploadedSongs.forEach((song) => {
        song.playerHolder.pauseVideo();
      });
      this.myUploadedSongs = [];
    }
  }

  dropSong(id: number) {
    if (id >= 0 && id < this.allSongs.length) {
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
          this.manageNextSongAfterCountdown(id, "allSongs");
          this.songLoading[id] = false;
          this.songLoadingListed.next([...this.songLoading]);
          this.dropState[id] = true;
          this.dropStateListed.next([...this.dropState]);
          this.audioPlayingListed.next(true);
        } else {
          this.allSongs[id].player.start(null, null, 30);
          this.manageCountdown();
          this.manageNextSongAfterCountdown(id, "allSongs");
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

  changePitch(id: number, value: any) {
    this.allSongs[id].playerHolder.setPlaybackRate(value);
  }
  changeVolume(id: number, value: any) {
    this.allSongs[id].playerHolder.setVolume(value);
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
      hearts: 11,
      heartedBy: [],
      date: new Date(),
      url: url,
      dropTime,
    });
  }

  songToDatabase(song: Song) {
    this.db.collection("songs").add(song);
  }

  heartSong(hearts: number, heartedBy: string[], songId: string, uid: string, i: number) {
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
    this.allSongs = [...songs];
    return this.allSongs;
  }

  deleteSong(songId: string, heartDocId: string) {
    this.db.doc("songs/" + songId).delete();
    this.db.doc("hearts/" + heartDocId).delete();
  }

  fetchAllSongs(uid: string) {
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    var item = this.item[Math.floor(Math.random() * this.item.length)];
    this.uid = uid;
    this.destroyAudioPlayer.next(false);
    this.firebaseSub = item
      .snapshotChanges()
      .pipe(
        map((docArray) => {
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
          if (!this.heartOperation) {
            this.allSongsListed.next([...this.checkIfHearted(songs, this.uid)]);
          }
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        },
        (error) => {
          // this.uiHelperService.allSongsLoadingStateChanged.next(false);
        }
      );
  }

  // fetchHearts(uid: string) {
  //   this.uid = uid;
  //   this.uiHelperService.allSongsLoadingStateChanged.next(true);
  //   this.heartsSub = this.db
  //     .collection("hearts", (ref) => ref.orderBy("name").limit(this.howManySongsFetched))
  //     .snapshotChanges()
  //     .pipe(
  //       map((docArray) => {
  //         return docArray.map((doc) => {
  //           return {
  //             heartDocId: doc.payload.doc.id,
  //             ...(doc.payload.doc.data() as Heart),
  //           };
  //         });
  //       })
  //     )
  //     .subscribe(
  //       (hearts: Heart[]) => {
  //         this.allHearts = hearts;
  //         if (typeof this.wasItHearted == "undefined") {
  //           this.wasItHearted = [];
  //           this.checkIfHearted(this.uid);
  //         }
  //         this.uiHelperService.allSongsLoadingStateChanged.next(false);
  //       },
  //       (error) => {
  //         this.uiHelperService.allSongsLoadingStateChanged.next(false);
  //       }
  //     );
  // }

  // fetchMyUploadHearts(uid: string) {
  //   this.uid = uid;
  //   this.uiHelperService.allSongsLoadingStateChanged.next(true);
  //   this.heartsSub = this.db
  //     .collection("hearts", (ref) =>
  //       ref.orderBy("name").where("userId", "==", uid).limit(this.howManySongsFetched)
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((docArray) => {
  //         return docArray.map((doc) => {
  //           return {
  //             heartDocId: doc.payload.doc.id,
  //             ...(doc.payload.doc.data() as Heart),
  //           };
  //         });
  //       })
  //     )
  //     .subscribe(
  //       (hearts: Heart[]) => {
  //         this.myUploadHearts = hearts;
  //         for (var i = 0; i < this.mySongs.length; i++) {
  //           this.mySongs[i].heartDocId = this.myUploadHearts[i].heartDocId;
  //           this.mySongs[i].hearts = this.myUploadHearts[i].hearts;
  //         }
  //         this.allMyUploadHeartsListed.next([...this.mySongs]);
  //         this.uiHelperService.allSongsLoadingStateChanged.next(false);
  //       },
  //       (error) => {
  //         this.uiHelperService.allSongsLoadingStateChanged.next(false);
  //       }
  //     );
  // }

  makeid(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  nextPage(hearts: number, name: string) {
    this.stopAllVideo();
    var item = this.item[Math.floor(Math.random() * this.item.length)];
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.moreSongsSub = item
      .snapshotChanges()
      .pipe(
        map((docArray) => {
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
      .subscribe(
        (songs: Song[]) => {
          if (!this.heartOperation) {
            this.allSongsListed.next([...this.checkIfHearted(songs, this.uid)]);
          }
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        }
      );
  }

  prevPage(hearts: number) {
    this.uiHelperService.allSongsLoadingStateChanged.next(true);
    this.moreSongsSub = this.db
      .collection("songs", (ref) =>
        ref.limitToLast(this.howManySongsFetched).orderBy("hearts", "desc").endBefore(hearts)
      )
      .snapshotChanges()
      .pipe(
        map((docArray) => {
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
      .subscribe(
        (songs: Song[]) => {
          this.allSongsListed.next([...this.checkIfHearted(songs, this.uid)]);
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        },
        (error) => {
          this.uiHelperService.allSongsLoadingStateChanged.next(false);
        }
      );
  }

  fetchMyUploads(uid: string) {
    this.uiHelperService.loadingStateChanged.next(true);
    this.mySongsSub = this.db
      .collection("songs", (ref) => ref.orderBy("hearts", "desc").where("userId", "==", uid))
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
              playerHolder: null,
              isHearted: null,
              ...(doc.payload.doc.data() as Song),
            };
          });
        })
      )
      .subscribe(
        (songs: Song[]) => {
          this.myUploadedSongs = songs;
          this.mySongsListed.next([...this.myUploadedSongs]);
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
      .collection("songs", (ref) =>
        ref.where("heartedBy", "array-contains", uid).orderBy("hearts", "desc")
      )
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
