import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UiHelperService } from "./../uiHelper/uiHelper.service";
import { CommentService } from "./comment.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommentsComponent } from "./comments.component";
import { environment } from "../../environments/environment";
import { AngularFireModule } from "@angular/fire";

describe("CommentsComponent", () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase), MatSnackBarModule],
      declarations: [CommentsComponent],
      providers: [CommentService, UiHelperService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", (done) => {
    expect(component).toBeTruthy();
    done();
  });
});
