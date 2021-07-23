import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-model',
  templateUrl: './payment-model.component.html',
  styleUrls: ['./payment-model.component.scss'],
})
export class PaymentModelComponent implements OnInit {
  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {}

  selectPolicy(policy) {
    console.log(policy);
    let policyData = {
      policy: policy,
    };
    this.paymentService.createDashboard(policyData).subscribe((data) => {
      console.log(data);
    });
  }
}
