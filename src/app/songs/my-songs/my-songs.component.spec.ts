import { SongService } from "./../song.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { CommentService } from "./../../comments/comment.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";

import { MySongsComponent } from "./my-songs.component";

describe("MySongsComponent", () => {
  let component: MySongsComponent;
  let fixture: ComponentFixture<MySongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        MatDialogModule,
      ],
      declarations: [MySongsComponent],
      providers: [CommentService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
