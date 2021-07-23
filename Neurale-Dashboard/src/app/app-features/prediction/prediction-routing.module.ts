import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryResolver } from 'src/app/services/user-directory.resolver';
import { PredictionPredictComponent } from './prediction-predict/prediction-predict.component';
import { PredictionStatusComponent } from './prediction-status/prediction-status.component';
import { PredictionTrainComponent } from './prediction-train/prediction-train.component';

const routes: Routes = [
    { path: '', redirectTo: 'status', pathMatch: 'full' },
    { path: 'status', component: PredictionStatusComponent },
    { path: 'train', component: PredictionTrainComponent, 
    resolve: {
        folders: UserDirectoryResolver,
      }
    },
    { path: 'predict', component: PredictionPredictComponent,
    resolve: {
        folders: UserDirectoryResolver,
      }
 },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [UserDirectoryResolver]
})
export class PredictionRoutingModule {}