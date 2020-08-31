import { MatSnackBarModule } from "@angular/material/snack-bar";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BrowseComponent } from "./browse.component";

describe("BrowseComponent", () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [BrowseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
