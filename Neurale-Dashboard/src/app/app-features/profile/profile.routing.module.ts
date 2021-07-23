import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileHomeComponent } from './profile-home/profile-home.component';


const routes: Routes = [
    { path: '', component: ProfileHomeComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {}