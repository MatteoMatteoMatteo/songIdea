import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SongService } from "./../../songs/song.service";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthService } from "./../../auth/auth-service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SideNavComponent } from "./sideNav.component";
import { reducers } from "./../../app.reducer";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { StoreModule } from "@ngrx/store";

describe("SideNavComponent", () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [SideNavComponent],
      providers: [AuthService, UiHelperService, SongService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
