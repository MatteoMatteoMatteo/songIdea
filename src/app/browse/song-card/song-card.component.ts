import { Subscription } from "rxjs/subscription";
import { CommentService } from "./../../comments/comment.service";
import { NgForm } from "@angular/forms";
import { Song } from "./../../songs/song.model";
import { Component, OnInit, Input } from "@angular/core";
import { Comment } from "../../comments/comment.model";

@Component({
  selector: "app-song-card",
  templateUrl: "./song-card.component.html",
  styleUrls: ["./song-card.component.scss"],
})
export class SongCardComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() allSongs: Song[];
  comments: Comment[] = [];
  allCommentsSubscription: Subscription;
  allComments: Comment[] = [];
  myComments: Comment[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.commentService.fetchAllComments();
  }

  getMyComments(songId: string) {
    return this.allComments.filter((comment) => comment.songId === songId);
  }

  onAddComment(form: NgForm, songId: string) {
    this.commentService.addComment(form, songId);
  }
}
