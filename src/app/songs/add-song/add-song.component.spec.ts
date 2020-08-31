import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../../uiHelper/uiHelper.service";
import { SongService } from "./../song.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./../../app.reducer";
import { FormsModule } from "@angular/forms";

import { AddSongComponent } from "./add-song.component";

describe("AddSongComponent", () => {
  let component: AddSongComponent;
  let fixture: ComponentFixture<AddSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        FormsModule,
      ],
      declarations: [AddSongComponent],
      providers: [SongService, UiHelperService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
