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
  uid: string;
  filePath: any;
  loadingSub: Subscription;
  genres: string[] = [
    "House",
    "Electro",
    "Electro House",
    "Chill",
    "Psytrance",
    "Progressive Trance",
    "Trance",
    "Goa",
    "Future Bass",
    "Drum & Bass",
    "Deep House",
    "Jazz",
    "Country",
    "Trap",
    "Hard Bass",
    "Reggeaton",
    "Bass House",
    "Hip Hop",
    "Dubstep",
    "Future House",
    "Drumstep",
    "Chillstep",
    "Tropical House",
    "Lofi",
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

    this.uid = localStorage.getItem("uid");

    this.genres.sort();
  }

  getTime(time: any) {
    var regExp = /[a-zA-Z]/g;

    if (regExp.test(time)) {
      this.uiHelperService.showSnackbar("Invalid time format", "ok", 3000);
      return;
    } else {
      var timeNoSpaces = time.replace(/\s/g, "");

      var divider = timeNoSpaces.split(":");
      // assuming string is in right format, i.e. mm:ss or hh:mm:ss
      var seconds = parseInt(divider[divider.length - 1]);
      seconds += parseInt(divider[divider.length - 2]) * 60;
      if (divider.length > 2) {
        seconds += parseInt(divider[divider.length - 3]) * 3600;
      }

      return seconds;
    }
  }

  matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    this.uiHelperService.showSnackbar("Invalid Youtube URL", "ok", 3000);
    return false;
  }

  getVideoIdFromURL(url: string) {
    return url.match("(youtu\.be\/|v=)([^&]*)")[2];
    // if (url.includes("&")) {
    //   var n = url.indexOf("=");
    //   var m = url.indexOf("&");
    //   var videoId = url.substring(n + 1, m);
    //   return videoId;
    // } else if(url.includes("")) {
    //   var n = url.indexOf("=");
    //   var videoId = url.substring(n + 1);
    //   return videoId;
    // }
  }

  onUpload(form: NgForm) {
    if (!this.matchYoutubeUrl(form.value.youtubeUrl)) return;

    this.dropTime = this.getTime(form.value.dropTime) - 10;
    if (isNaN(this.dropTime)) return;

    this.isLoading = true;
    this.videoId = this.getVideoIdFromURL(form.value.youtubeUrl);
    this.songName = form.value.songName;
    this.url = form.value.youtubeUrl;

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
