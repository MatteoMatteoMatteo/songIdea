import { SongService } from "./../../songs/song.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { NgForm } from "@angular/forms";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit {
  isLoading = false;
  videoId: string;
  songName: string;
  songGenre: string;
  url: string;
  file: any;
  filePath: any;
  uid: string;
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
    "Pop",
    "Synth Wave",
    "Alternative",
    "Acoustic",
  ];
  @Output() switchWhenUploaded: EventEmitter<any> = new EventEmitter();
  constructor(
    private songService: SongService,
    private storage: AngularFireStorage,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
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
    this.songGenre = form.value.genre;
    this.songService.uploadSong(this.songName, this.songGenre, this.videoId, this.uid, this.url);
  }
}
