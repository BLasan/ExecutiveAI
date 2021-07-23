import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamContainerComponent } from './team-container/team-container.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TeamRoutingModule
  ],
  declarations: [TeamContainerComponent]
})
export class TeamModule { }
