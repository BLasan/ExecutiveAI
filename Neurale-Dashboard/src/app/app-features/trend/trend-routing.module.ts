import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryResolver } from 'src/app/services/user-directory.resolver';
import { TrendTrainComponent } from './trend-train/trend-train.component';

const routes: Routes = [
    { path: '', redirectTo: 'status', pathMatch: 'full' },
    { path: 'train', component: TrendTrainComponent,
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
export class TrendRoutingModule {}