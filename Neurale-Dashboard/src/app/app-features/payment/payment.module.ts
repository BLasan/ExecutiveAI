import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PaymentModelComponent } from './payment-model/payment-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PaymentModelComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, FormsModule],
})
export class PaymentModule {}
