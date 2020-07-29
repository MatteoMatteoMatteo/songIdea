import { Song } from "./../song.model";
import { NgForm } from "@angular/forms";
import { SongService } from "./../song.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"],
})
export class AddSongComponent implements OnInit, OnDestroy {
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
  constructor(private songService: SongService) {}

  ngOnInit() {
    this.songSubscription = this.songService.mySongsChanged.subscribe(
      (songs) => (this.songs = songs)
    );
    this.songService.fetchSongs();

    this.genres.sort();
  }

  onUpload(form: NgForm) {
    this.songService.uploadSong(form);
  }

  ngOnDestroy() {
    this.songSubscription.unsubscribe();
  }
}
