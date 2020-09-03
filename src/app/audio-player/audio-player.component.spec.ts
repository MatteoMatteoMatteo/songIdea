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
import { By } from "@angular/platform-browser";

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

  it("check if fxToggle is working", () => {
    expect(component.fxToggler).toBe(false);
    component.fxToggle();
    expect(component.fxToggler).toBe(true);
    component.fxToggle();
    expect(component.fxToggler).toBe(false);
  });

  it("destroyMe should be false", () => {
    expect(component.destroyMe).toBe(false);
    // comp.clicked();
    // expect(comp.isOn).toBe(true, "on after click");
    // comp.clicked();
    // expect(comp.isOn).toBe(false, "off after second click");
  });
});
