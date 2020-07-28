import { Song } from "./../song.model";
import { NgForm } from "@angular/forms";
import { SongService } from "./../song.service";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit {
  songs: Observable<any>;
  constructor(private songService: SongService, private db: AngularFirestore) {}

  ngOnInit(): void {
    this.songs = this.db
      .collection("genres")
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
      );
  }

  onUpload(form: NgForm) {
    console.log(form.value);
  }
}
