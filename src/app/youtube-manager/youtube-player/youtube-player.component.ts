import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-youtube-player",
  templateUrl: "./youtube-player.component.html",
  styleUrls: ["./youtube-player.component.scss"],
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId: any;
  @Input() playerId: any;
  public YT: any;
  public video: any;
  private player: any;
  public reframed: Boolean = false;
  youtube: any;

  constructor() {}

  init() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => this.startVideo();
  }

  startVideo() {
    this.reframed = false;
    new window["YT"].Player(this.playerId, {
      videoId: this.videoId,
      width: 300,
      height: 200,
      playerVars: {
        start: 40,
        end: 65,
        autoplay: 0,
        modestbranding: 0,
        controls: 0,
        disablekb: 0,
        rel: 0,
        showinfo: 0,
        ecver: 0,
        fs: 0,
        playsinline: 0,
      },
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  onPlayerStateChange(event) {
    console.log("StateChanged");
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }

  onPlayerReady(event) {
    console.log(this.player);
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log("" + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

  drop(id: number) {
    console.log(this.player);
  }
  ngOnInit(): void {
    this.init();
  }
}
