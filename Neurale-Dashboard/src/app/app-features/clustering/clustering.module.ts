import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusteringRoutingModule } from './clustering-routing.module';
import { ClusteringTrainComponent } from './clustering-train/clustering-train.component';
import { ClusteringPredictComponent } from './clustering-predict/clustering-predict.component';
import { ClusteringStatusComponent } from './clustering-status/clustering-status.component';
import { AppCommonModule } from 'src/app/app-common/app-common.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [CommonModule, ClusteringRoutingModule, AppCommonModule, ChartsModule],
  declarations: [
    ClusteringTrainComponent,
    ClusteringPredictComponent,
    ClusteringStatusComponent,
  ],
})
export class ClusteringModule {}
