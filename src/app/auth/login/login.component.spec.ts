import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule } from "@angular/forms";
import { SongService } from "./../../songs/song.service";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { AuthService } from "./../auth-service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        FormsModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [LoginComponent],
      providers: [AuthService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
