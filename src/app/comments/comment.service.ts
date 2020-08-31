import { Comment } from "./comment.model";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable()
export class CommentService implements OnDestroy {
  private firebaseSub: Subscription;
  songPlaying = new Subject<Comment>();
  private allComments: Comment[] = [];
  myCommentsListed = new Subject<Comment[]>();
  allCommentsListed = new Subject<Comment[]>();

  constructor(private db: AngularFirestore, private uiHelperService: UiHelperService) {}

  addComment(form: NgForm, songId: string, uid: string) {
    this.commentToDatabase({
      uid: uid,
      songId: songId,
      content: form.value.content,
    });
  }

  commentToDatabase(comment: Comment) {
    this.db.collection("comments").add(comment);
  }

  fetchAllComments() {
    this.firebaseSub = this.db
      .collection("comments")
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              commentId: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Comment),
            };
          });
        })
      )
      .subscribe(
        (comments: Comment[]) => {
          this.allComments = comments;
          this.allCommentsListed.next([...this.allComments]);
        },
        (error) => {}
      );
  }

  ngOnDestroy() {
    this.firebaseSub.unsubscribe();
  }
}
