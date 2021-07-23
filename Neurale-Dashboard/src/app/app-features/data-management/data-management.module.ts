import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagementContainerComponent } from './data-management-container/data-management-container.component';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DirectoryManagementComponent } from './directory-management/directory-management.component';
import { FileManagementComponent } from './file-management/file-management.component';
import { AppCommonModule } from 'src/app/app-common/app-common.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    DataManagementRoutingModule,
    AppCommonModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  declarations: [DataManagementContainerComponent, DirectoryManagementComponent, FileManagementComponent]
})
export class DataManagementModule { }
