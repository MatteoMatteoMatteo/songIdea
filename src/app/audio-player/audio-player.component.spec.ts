import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { SongService } from "./../songs/song.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import { AudioPlayerComponent } from "./audio-player.component";
import { reducers } from "./../app.reducer";
import { environment } from "../../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { FormsModule } from "@angular/forms";

describe("AudioPlayerComponent", () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        FormsModule,
      ],
      declarations: [AudioPlayerComponent],
      providers: [SongService, UiHelperService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
