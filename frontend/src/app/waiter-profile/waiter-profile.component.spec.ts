import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterProfileComponent } from './waiter-profile.component';

describe('WaiterProfileComponent', () => {
  let component: WaiterProfileComponent;
  let fixture: ComponentFixture<WaiterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterProfileComponent]
    });
    fixture = TestBed.createComponent(WaiterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
