import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamContainerComponent } from './team-container/team-container.component';

const routes: Routes = [{ path: '', component: TeamContainerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamRoutingModule {}