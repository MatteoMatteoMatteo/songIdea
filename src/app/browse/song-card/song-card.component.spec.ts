import { SongService } from "./../../songs/song.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { CommentService } from "./../../comments/comment.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";

import { SongCardComponent } from "./song-card.component";

describe("SongCardComponent", () => {
  let comp: SongCardComponent;
  let fixture: ComponentFixture<SongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        StoreModule.forRoot(reducers),
        MatSnackBarModule,
      ],
      declarations: [SongCardComponent],
      providers: [CommentService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongCardComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(comp).toBeTruthy();
  });

  it("should be undefined after construction", () => {
    expect(comp.allSongs).toBeUndefined();
  });
});
