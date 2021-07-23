import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendRoutingModule } from './trend-routing.module';
import { TrendTrainComponent } from './trend-train/trend-train.component';
import { AppCommonModule } from 'src/app/app-common/app-common.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    TrendRoutingModule,
    AppCommonModule,
    ChartsModule
  ],
  declarations: [
    TrendTrainComponent,
  ]
})
export class TrendModule { }
