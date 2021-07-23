import { NgModule } from '@angular/core';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { Routes, RouterModule } from '@angular/router';
import { ViewDashboardComponent } from './view-dashboard/view-dashboard.component';
import { UserDirectoryResolver } from 'src/app/services/user-directory.resolver';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardAllResolver } from './DashboardAll.resolver';

const routes: Routes = [
    { path: '', 
      component: ViewDashboardComponent,
      resolve: {
         folders: UserDirectoryResolver,
         dashboards: DashboardAllResolver
      } 
    },
    { path: ':id', 
      component: DashboardContainerComponent,
      resolve: {
        dashboardData: DashboardResolver
      }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DashboardResolver, DashboardAllResolver]
})
export class DashboardRoutingModule {}

