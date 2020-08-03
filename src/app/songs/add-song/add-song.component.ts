import { AngularFireStorage } from "@angular/fire/storage";
import { Song } from "./../song.model";
import { NgForm } from "@angular/forms";
import { SongService } from "./../song.service";
import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit {
  file: any;
  filePath: any;
  path: string;
  uid: string;
  uidSub: Subscription;
  genres: string[] = [
    "House",
    "Electro",
    "Chill",
    "Future Bass",
    "Dance",
    "Rock",
    "Pop",
    "Synth Wave",
    "Alternative",
    "Acoustic",
  ];
  formData: { name: string; genre: string };
  songs: Song[];
  songSubscription: Subscription;
  constructor(private songService: SongService, private storage: AngularFireStorage) {}

  ngOnInit() {
    this.songService.fetchMySongs();

    this.genres.sort();
  }

  onUpload(form: NgForm) {
    const fileRef = this.storage.ref(this.filePath);
    this.storage
      .upload(this.filePath, this.file)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          alert("hi");
          fileRef.getDownloadURL().subscribe((url) => {
            form.value.songFile = url;
            this.songService.uploadSong(form);
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
