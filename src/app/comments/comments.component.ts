import { Comment } from "./comment.model";
import { NgForm } from "@angular/forms";
import { Song } from "./../songs/song.model";
import { Subscription } from "rxjs/subscription";
import { SongService } from "./../songs/song.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  mySongSubscription: Subscription;
  mySongs: Song[] = [];

  constructor(private songService: SongService) {}

  ngOnInit(): void {}

  onAddComment(form: NgForm) {
    this.songService.addComment(form);
  }
}
