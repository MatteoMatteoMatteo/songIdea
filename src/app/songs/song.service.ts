import { Subject } from "rxjs/Subject";
import { Song } from "./song.model";

export class SongService {
  private mySongs: Song[] = [
    { id: "song1", name: "Canvai - Love", genre: "Electro" },
    { id: "song2", name: "Canvai - Fly", genre: "House" },
    { id: "song3", name: "Canvai - Sunshine", genre: "Chill" },
  ];

  private playingSong: Song;
  songPlaying = new Subject<Song>();

  getMySongs() {
    return this.mySongs.slice();
  }

  playSong(selectedId: String) {
    // this.playingSong = this.mySongs.find((song) => {
    //   song.id === selectedId;
    // });
    this.playingSong = this.mySongs.find((song) => song.id === selectedId);
    console.log(this.playingSong);
    this.songPlaying.next({ ...this.playingSong });
  }

  getPlayingSong() {
    return { ...this.playingSong };
  }
}
