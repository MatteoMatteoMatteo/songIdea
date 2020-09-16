import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-youtube-player",
  templateUrl: "./youtube-player.component.html",
  styleUrls: ["./youtube-player.component.scss"],
})
export class YoutubePlayerComponent implements OnInit {
  @Input() howMany: any;
  @Input() playerId: any;
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;

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
    for (let i = 0; i <= this.howMany; i++) {
      var player = new window["YT"].Player(`player${i}`, {
        videoId: this.video,
        width: 300,
        height: 200,
        playerVars: {
          start: 40,
          end: 65,
          autoplay: 0,
          modestbranding: 0,
          controls: 1,
          disablekb: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          playsinline: 0,
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
        },
      });
    }
  }

  onPlayerReady(event) {
    // event.target.playVideo();
  }
  ngOnInit(): void {
    this.video = "4TeKHMnOT7o";
    this.init();
  }
}
