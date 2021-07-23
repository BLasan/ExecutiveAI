import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryResolver } from 'src/app/services/user-directory.resolver';
import { DataManagementContainerComponent } from './data-management-container/data-management-container.component';

const routes: Routes = [
    { path: '', 
      component: DataManagementContainerComponent,
      resolve: {
          directories: UserDirectoryResolver
      }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [UserDirectoryResolver]
})
export class DataManagementRoutingModule {}

