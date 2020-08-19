import { AngularFireStorage } from "@angular/fire/storage";
import { Song } from "./../song.model";
import { NgForm } from "@angular/forms";
import { SongService } from "./../song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { finalize } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit {
  songName: string;
  songGenre: string;
  isLoading = false;
  file: any;
  filePath: any;
  path: string;
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
  songs: Song[];
  songSubscription: Subscription;
  @Output() switchWhenUploaded: EventEmitter<any> = new EventEmitter();
  constructor(
    private songService: SongService,
    private storage: AngularFireStorage,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store.select(fromRoot.getUid).subscribe((uid) => {
      this.uid = uid;
      this.songService.fetchMySongs(this.uid);
    });

    this.genres.sort();
  }

  onUpload(form: NgForm) {
    this.isLoading = true;
    this.songName = form.value.songName;
    this.songGenre = form.value.genre;
    const fileRef = this.storage.ref(this.filePath);
    this.storage
      .upload(this.filePath, this.file)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.songService.uploadSong(this.songName, this.songGenre, url, this.uid);
            this.switchWhenUploaded.emit();
            this.isLoading = false;
          });
        })
      )
      .subscribe();
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    this.filePath = `${localStorage.getItem("userId")}-${this.file.name}`;
  }
}
