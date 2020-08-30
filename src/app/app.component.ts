import { Subscription } from "rxjs";
import { SongService } from "./songs/song.service";
import { nicer } from "./route-animations";
import { AuthService } from "./auth/auth-service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [nicer],
})
export class AppComponent implements OnInit, OnDestroy {
  audioPlayingSub: Subscription;
  audioPlaying = false;
  constructor(private authService: AuthService, private songService: SongService) {}
  ngOnInit() {
    this.authService.initAuthListener();
    this.audioPlayingSub = this.songService.audioPlayingListed.subscribe((bool) => {
      this.audioPlaying = bool;
      console.log(this.audioPlaying);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  }

  ngOnDestroy() {
    this.audioPlayingSub.unsubscribe();
  }
}
