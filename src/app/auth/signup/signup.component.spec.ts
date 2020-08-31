import { SongService } from "./../../songs/song.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { AuthService } from "./../auth-service";
import { RouterTestingModule } from "@angular/router/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";
import { FormsModule } from "@angular/forms";

import { SignupComponent } from "./signup.component";

describe("SignupComponent", () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatSnackBarModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [SignupComponent],
      providers: [AuthService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
