import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionRoutingModule } from './prediction-routing.module';
import { PredictionStatusComponent } from './prediction-status/prediction-status.component';
import { PredictionPredictComponent } from './prediction-predict/prediction-predict.component';
import { PredictionTrainComponent } from './prediction-train/prediction-train.component';
import { AppCommonModule } from 'src/app/app-common/app-common.module';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PredictionRoutingModule,
    AppCommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    PredictionStatusComponent,
    PredictionPredictComponent,
    PredictionTrainComponent,
  ],

})
export class PredictionModule { }
