import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SongService } from "./../../songs/song.service";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { AuthService } from "./../../auth/auth-service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";

import { MainNavComponent } from "./mainNav.component";

describe("MainNavComponent", () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [MainNavComponent],
      providers: [AuthService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
