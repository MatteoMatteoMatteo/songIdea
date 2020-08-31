import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropButtonComponent } from './drop-button.component';

describe('DropButtonComponent', () => {
  let component: DropButtonComponent;
  let fixture: ComponentFixture<DropButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
