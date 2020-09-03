import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ScrollComponent } from "./scroll.component";
import { environment } from "../../environments/environment";
import { AngularFireModule } from "@angular/fire";

describe("ScrollComponent", () => {
  let component: ScrollComponent;
  let fixture: ComponentFixture<ScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
      declarations: [ScrollComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
