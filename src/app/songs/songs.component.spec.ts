import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { SongService } from "./song.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../environments/environment";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../app.reducer";

import { SongsComponent } from "./songs.component";

describe("SongsComponent", () => {
  let component: SongsComponent;
  let fixture: ComponentFixture<SongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
      ],
      declarations: [SongsComponent],
      providers: [SongService, UiHelperService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
