import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDeliveryComponent } from './guest-delivery.component';

describe('GuestDeliveryComponent', () => {
  let component: GuestDeliveryComponent;
  let fixture: ComponentFixture<GuestDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestDeliveryComponent]
    });
    fixture = TestBed.createComponent(GuestDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
