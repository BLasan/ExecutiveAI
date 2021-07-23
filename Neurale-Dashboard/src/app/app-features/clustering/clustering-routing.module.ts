import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryResolver } from 'src/app/services/user-directory.resolver';
import { ClusteringPredictComponent } from './clustering-predict/clustering-predict.component';
import { ClusteringStatusComponent } from './clustering-status/clustering-status.component';
import { ClusteringTrainComponent } from './clustering-train/clustering-train.component';

const routes: Routes = [
    { path: '', redirectTo: 'status', pathMatch: 'full' },
    { path: 'status', component: ClusteringStatusComponent },
    { path: 'train', component: ClusteringTrainComponent,  
    resolve: {
        folders: UserDirectoryResolver,
      } 
    },
    { path: 'predict', component: ClusteringPredictComponent,
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
export class ClusteringRoutingModule {}