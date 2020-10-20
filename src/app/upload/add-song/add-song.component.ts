import { Subscription } from "rxjs";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { SongService } from "./../../songs/song.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { NgForm } from "@angular/forms";
import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit, OnDestroy {
  isLoading = false;
  videoId: string;
  songName: string;
  songGenre: string;
  dropTime: number;
  url: string;
  file: any;
  filePath: any;
  uid: string;
  loadingSub: Subscription;
  genres: string[] = [
    "House",
    "Electro",
    "Chill",
    "Future Bass",
    "Drum & Bass",
    "Jazz",
    "Country",
    "Trap",
    "Other",
    "Hard Bass",
    "Dubstep",
    "Drumstep",
    "Dancehall",
    "Reggae",
    "Dance",
    "Rock",
    "Funk",
    "Pop",
    "Synth Wave",
    "Alternative",
    "Acoustic",
  ];
  @Output() switchWhenUploaded: EventEmitter<any> = new EventEmitter();
  constructor(
    private songService: SongService,
    private storage: AngularFireStorage,
    private store: Store<fromRoot.State>,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit() {
    this.loadingSub = this.uiHelperService.uploadSongListed.subscribe((state) => {
      this.isLoading = state;
      if (state == false) this.switchWhenUploaded.emit();
    });
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
    });
    this.genres.sort();
  }

  getVideoIdFromURL(url: string) {
    var n = url.indexOf("=");
    var videoId = url.substring(n + 1);
    return videoId;
  }

  onUpload(form: NgForm) {
    this.isLoading = true;
    this.videoId = this.getVideoIdFromURL(form.value.youtubeUrl);
    this.songName = form.value.songName;
    this.url = form.value.youtubeUrl;
    this.dropTime = form.value.dropTime - 10;
    this.songGenre = form.value.genre;
    this.songService.uploadSong(
      this.songName,
      this.songGenre,
      this.videoId,
      this.uid,
      this.url,
      this.dropTime
    );
  }

  ngOnDestroy() {
    this.songService.hideAudioPlayer = true;
    if (this.loadingSub) this.loadingSub.unsubscribe();
  }
}
