import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterReservationsComponent } from './waiter-reservations.component';

describe('WaiterReservationsComponent', () => {
  let component: WaiterReservationsComponent;
  let fixture: ComponentFixture<WaiterReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterReservationsComponent]
    });
    fixture = TestBed.createComponent(WaiterReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
