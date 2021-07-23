import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CsvSelectorService } from 'src/app/services/csv-selector.service';

@Component({
  selector: 'app-csv-selector',
  templateUrl: './csv-selector.component.html',
  styleUrls: ['./csv-selector.component.scss']
})
export class CsvSelectorComponent implements OnInit {

  @Input() csvSelectorType: string;
  @Input() folders: any[];
  @Output() csvSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() folderSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() csvHeaders: EventEmitter<any> = new EventEmitter<any>();
  @Output() csvData: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnTypes: EventEmitter<any> = new EventEmitter<any>();
  @Output() objectValues: EventEmitter<any> = new EventEmitter<any>();
  @Output() nullColumns: EventEmitter<any> = new EventEmitter<any>();
  @Output() delimiter: EventEmitter<any> = new EventEmitter<any>();

  folderArray: any[] = [];
  csvArray: any = [];
  csvDataHeads: any[] = [];
  csvDataValues: any[] = [];
  csvHeaderCount: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _csvSelectorService: CsvSelectorService
  ) {
  }

  ngOnInit(): void {
    this.folderArray = this.folders;
    this.csvSelectorType = 'Training';
  }

  currentFolderName: string;

  selectFolder(folderName) {
    this.folderSelected.emit(folderName);
    this.currentFolderName = folderName;
    this.csvArray = this.folderArray.filter((x: any) => x.M.name.S === folderName)[0].M.files.L;
  }

  nullColumnsArray: any;
  dataTypeArray: any;
  spinner: boolean = false;
  loadData(csvName: string) {
    this.spinner = true
    this.csvSelected.emit(csvName);
    this._csvSelectorService.loadCSVData(this.currentFolderName, csvName).subscribe((response: any) => {
      console.log(response)
      this.csvDataHeads = response.columns;
      this.csvHeaders.emit(this.csvDataHeads);
      this.csvHeaderCount = this.csvDataHeads.length;
      this.csvDataValues = response.header_rows;
      this.csvData.emit(this.csvDataValues);
      const nullColumns = response.null_data;
      this.nullColumns.emit(nullColumns);
      const objData = response.object_data;
      this.objectValues.emit(objData);
      const columnTypes = response.data_types;
      this.columnTypes.emit(columnTypes);
      const delimiter = response.delimiter;
      console.log(delimiter)
      this.delimiter.emit(delimiter);
      this.dataTypeArray = response.data_types
      this.nullColumnsArray = response.null_data
    });
    this.spinner = false
  }

  loadColumn(data: any[], colId: any) {
    let columnId = parseInt(colId, 10);
    //console.log(colId)
    return data[columnId];
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
