import { AngularFirestore } from "@angular/fire/firestore";
import { tap, map, throttleTime, mergeMap, scan } from "rxjs/operators";
import { Component, ViewChild } from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-scroll",
  templateUrl: "./scroll.component.html",
  styleUrls: ["./scroll.component.scss"],
})
export class ScrollComponent {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  batch = 2;
  theEnd = false;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap((n) => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite = batchMap.pipe(map((v) => Object.values(v)));
  }

  getBatch(offset) {
    return this.db
      .collection("songs", (ref) => ref.orderBy("name").startAfter(offset).limit(this.batch))
      .snapshotChanges()
      .pipe(
        tap((arr) => (arr.length ? null : (this.theEnd = true))),
        map((arr) => {
          return arr.reduce((acc, cur) => {
            const id = cur.payload.doc.id;
            const data = cur.payload.doc.data();
            return { ...acc, [id]: data };
          }, {});
        })
      );
  }

  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i) {
    return i;
  }
}
