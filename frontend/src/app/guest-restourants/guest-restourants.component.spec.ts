import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRestourantsComponent } from './guest-restourants.component';

describe('GuestRestourantsComponent', () => {
  let component: GuestRestourantsComponent;
  let fixture: ComponentFixture<GuestRestourantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestRestourantsComponent]
    });
    fixture = TestBed.createComponent(GuestRestourantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
