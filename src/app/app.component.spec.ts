import { StoreModule } from "@ngrx/store";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./uiHelper/uiHelper.service";
import { SongService } from "./songs/song.service";
import { AuthService } from "./auth/auth-service";
import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { reducers } from "./app.reducer";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        StoreModule.forRoot(reducers),
      ],
      declarations: [AppComponent],
      providers: [AuthService, SongService, UiHelperService],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
