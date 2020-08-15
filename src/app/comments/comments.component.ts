import { CommentService } from "./comment.service";
import { Comment } from "./comment.model";
import { Subscription } from "rxjs";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  allCommentsSubscription: Subscription;
  allComments: Comment[] = [];
  @Input() songId: [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.allCommentsSubscription = this.commentService.allCommentsListed.subscribe((comments) => {
      this.allComments = comments;
    });
    this.commentService.fetchAllComments();

    setTimeout(() => {
      console.log(this.songId);
    }, 2000);
  }
}
