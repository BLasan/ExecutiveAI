import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../app-common/app-common.module';
import { CsvSelectorComponent } from '../app-common/csv-selector/csv-selector.component';
import { ClusteringModule } from './clustering/clustering.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentModule } from './payment/payment.module';
import { PredictionModule } from './prediction/prediction.module';
import { ProfileModule } from './profile/profile.module';
import { TeamModule } from './team/team.module';
import { TrendModule } from './trend/trend.module';

@NgModule({
  exports: [DashboardModule, ClusteringModule, DashboardModule, TeamModule, TrendModule, ProfileModule, PaymentModule],
  declarations: [],
  providers: [DatePipe],
})
export class AppFeatureModule {}
