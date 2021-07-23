import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvSelectorComponent } from './csv-selector/csv-selector.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  declarations: [CsvSelectorComponent, CommonDialogComponent],
  exports: [CsvSelectorComponent]
})
export class AppCommonModule { }
