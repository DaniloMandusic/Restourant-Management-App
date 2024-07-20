import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrdersComponent } from './waiter-orders.component';

describe('WaiterOrdersComponent', () => {
  let component: WaiterOrdersComponent;
  let fixture: ComponentFixture<WaiterOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterOrdersComponent]
    });
    fixture = TestBed.createComponent(WaiterOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
