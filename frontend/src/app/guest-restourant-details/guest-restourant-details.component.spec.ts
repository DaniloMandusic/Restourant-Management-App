import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRestourantDetailsComponent } from './guest-restourant-details.component';

describe('GuestRestourantDetailsComponent', () => {
  let component: GuestRestourantDetailsComponent;
  let fixture: ComponentFixture<GuestRestourantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestRestourantDetailsComponent]
    });
    fixture = TestBed.createComponent(GuestRestourantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
