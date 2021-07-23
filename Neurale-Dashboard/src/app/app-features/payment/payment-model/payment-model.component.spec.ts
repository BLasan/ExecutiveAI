import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModelComponent } from './payment-model.component';

describe('PaymentModelComponent', () => {
  let component: PaymentModelComponent;
  let fixture: ComponentFixture<PaymentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
