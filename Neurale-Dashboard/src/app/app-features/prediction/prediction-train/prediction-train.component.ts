import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PredictionServiceService } from 'src/app/services/prediction-service.service';

@Component({
  selector: 'app-prediction-train',
  templateUrl: './prediction-train.component.html',
  styleUrls: ['./prediction-train.component.scss']
})
export class PredictionTrainComponent implements OnInit {

  predictionForm: FormGroup;

  ycolumn: string;
  csvSelectorType: string;
  csvName: string;
  folderName: string;
  dataArray: any;
  headerCount: number;
  y_column_selected: any;
  modelJson: any;
  csvDataHeads = [];
  dateArray: string[] = [];
  folderArray: any[] = [];
  columnTypesArray: any[] = [];
  objectValuesArray: any[] = [];
  selectedObjectValueArray: any[] = [];
  nullColumnsArray: any[] = [];
  job_id: any[] = [];
  delimiter: string;

  constructor(
    private route: ActivatedRoute,
    private _predictionService: PredictionServiceService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.route.data.subscribe((data: { folders: any }) => {
      console.log(data);
      this.folderArray = data.folders.folders;
    });
  }

  ngOnInit(): void {}

  childChange(event) {
    if (event.target.innerText == 'Training') this.csvSelectorType = 'Training';
    if (event.target.innerText == 'Prediction') this.csvSelectorType = 'Prediction';
  }

  getCSVName(event: any) {
    this.csvName = event;
  }

  getDelimiter(event: any) {
    this.delimiter = event;
  }

  getFolderName(event: any) {
    this.folderName = event;
  }

  getHeaders(event: any) {
    this.csvDataHeads = event;
    this.headerCount = this.csvDataHeads.length;
    this.csvDataHeads.forEach((element) => {
      if (element.includes('Dt')) {
        this.dateArray.push(element);
      }
    });
  }

  getData(event: any) {
    this.dataArray = event;
  }

  getNullColumns(event: any) {
    this.nullColumnsArray = event;
  }

  getColumnTypes(event: any) {
    this.columnTypesArray = event;
  }

  getObjects(event: any) {
    this.objectValuesArray = event;
  }

  loadColumn(data: any, index: any) {
    let columnId = parseInt(index, 10);
    return data[columnId];
  }

  modelName: string;
  getModelName(event) {
    console.log(event.target.value)
    this.modelName = event.target.value;
  }

  selectedY: string;
  changeY(e){
    console.log(e.target.value);
    this.selectedY = e.target.value;
  }

  train() {
    let selectedColumns: any[] = new Array();
    this.csvDataHeads.forEach((value: any) => {
      let htmlElement = <HTMLInputElement>document.getElementById(value);
      let isSelected = htmlElement.checked;
      if (isSelected) {
        selectedColumns.push(value);
      }
    });
    let yColumn = [this.selectedY];
    let dateHeads: any = [];

    var _selectedColumns: any = [];
    selectedColumns.forEach((element) => {
      var value = element.replace(/[^a-zA-Z0-9]/g,"_")
      _selectedColumns.push({ S: value });
    });

    var _yColumn: any = [];
    yColumn.forEach((element) => {
      var value = element.replace(/[^a-zA-Z0-9]/g,"_")
      _yColumn.push({ S: value });
    });

    var _dateColumns: any = [];
    selectedColumns.forEach((element: any) => {
      var value = element.replace(/[^a-zA-Z0-9]/g,"_")
      if (this.columnTypesArray.some((e: any) => e.col_name === element && e.data_type.includes("datetime"))) {
        _dateColumns.push({"S": value})
      }
    })

    console.log(_selectedColumns, _yColumn, _dateColumns, this.modelName, this.folderName, this.csvName);

    this._predictionService
      .trainXGBoostPrediction(_selectedColumns, _yColumn, _dateColumns, this.modelName, this.folderName, this.csvName, this.delimiter)
      .subscribe((response: any) => {
        console.log(response);
      });

    this.router.navigate(['/prediction/status']);
  }

  // Page Navigators
  currentPage: number = 1;
  next(){
    this.currentPage = this.currentPage + 1;
  }

  previous(){
    this.currentPage = this.currentPage - 1;
  }

}
