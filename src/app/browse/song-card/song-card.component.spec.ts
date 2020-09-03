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
  let songService: SongService;

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

  it("songs should be undefined after construction", () => {
    expect(comp.allSongs).toBeUndefined();
  });

  it("check on fx from songService", () => {
    songService = TestBed.inject(SongService);
    expect(songService.autoFilter).toBeDefined();
    expect(songService.reverb).toBeDefined();
  });

  it("check on SongService if the first 3 songs get loaded", async(() => {
    songService = TestBed.inject(SongService);
    songService.allSongsListed.subscribe((songs) => expect(songs.length).toBe(3));
  }));

  it("check on button styling", () => {
    expect(comp.buttonStyling).toMatch("bigDropButton");
  });

  it("check on button title", () => {
    expect(comp.buttonTitle).toMatch("DROP");
  });
});
