import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PredictionServiceService } from 'src/app/services/prediction-service.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prediction-predict',
  templateUrl: './prediction-predict.component.html',
  styleUrls: ['./prediction-predict.component.scss']
})
export class PredictionPredictComponent implements OnInit {


  ycolumn: string;
  csvSelectorType: string;
  csvName: string;
  folderName: string;
  dataArray: any;
  headerCount: number;
  y_column_selected: any;
  csvDataHeads = [];
  dateArray: string[] = [];
  folderArray: any[] = [];
  columnTypesArray: any[] = [];
  objectValuesArray: any[] = [];
  selectedObjectValueArray: any[] = [];
  nullColumnsArray: any[] = [];
  job_id: any[] = [];

  constructor(private route: ActivatedRoute, private _predictionService: PredictionServiceService, private formBuilder: FormBuilder, private datePipe: DatePipe) { 
    this.route.data.subscribe((data: { folders: any }) => {
      this.folderArray = data.folders.folders;
    });
  }

  ngOnInit() {
  }

  checkDateColumn(column: string) {
    var selColumn = this.columnTypesArray.filter((x: any) => x.col_name === column)[0];
    if (selColumn.data_type === 'datetime64[ns]') {
      return true;
    }
    return false;
  }

  checkObjectColumn(column: string) {
    var selColumn = this.columnTypesArray.filter((x: any) => x.col_name === column)[0];
    if (selColumn.data_type === 'object') {
      this.selectedObjectValueArray = this.objectValuesArray.filter((x: any) => x.col_name === column)[0].values;
      return true;
    }
    return false;
  }

  getColumnTypes(event: any) {
    this.columnTypesArray = event;
  }

  getObjects(event: any) {
    this.objectValuesArray = event;
  }

  getCSVName(event: any) {
    this.csvName = event;
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

  models = [];
  getModels() {
    this._predictionService.getModelsByCsvName(this.csvName, 'regression').subscribe((response) => {
      console.log(response)
      this.job_id = response.job_id_array
      this.models = response.jobs;
    });
  }

  predictionForm = new FormGroup({});
  isLoaded: boolean = false;

  modelIndex: any;
  selectedModel: any;
  modelID: any;
  m: any;
  selectModel(model, modelIndex) {
    this.m = model
    this.modelIndex = modelIndex;
    this.selectedModel = this.models[modelIndex];

    this.modelID =  this.job_id.filter(s => s['name'] === model['M']['model_name']['S'])[0]['id']

    this.models[modelIndex]['M']['x_columns']['L'].forEach((element) => {
      this.predictionForm.addControl(element['S'], new FormControl());
    });
  }

  predictedValue: any;
  getPrediction() {
    var columns = [];
    this.selectedModel['M']['x_columns']['L'].forEach((element) => {
      var col = element['S'].replace(/[^a-zA-Z0-9]/g,"_")
      columns.push(col);
    });

    var date_cols = [];
    this.selectedModel['M']['date_columns']['L'].forEach((element) => {
      var col = element['S'].replace(/[^a-zA-Z0-9]/g,"_")
      date_cols.push(col);
    });

    var dir_name = this.folderName;
    var model_name = this.selectedModel['M']['model_name']['S'];

    var d = [];

    var y = this.models[this.modelIndex]['M']['y_column']['L']['0']['S'];
    var cols = [];
    var array = this.models[this.modelIndex]['M']['trained_columns']['L'].filter(function (item) {
      return item['S'] !== y;
    });

    let col_array = []
    array.forEach(element => {
      var col = element['S'].replace(/[^a-zA-Z0-9]/g,"_")
      col_array.push(col)
    });

    array.forEach((element) => {
      cols.push(element['S']);
      if (date_cols.indexOf(element['S']) > -1) {
        var patchObj: any = {};
        var date = this.predictionForm.value[element['S']];
        patchObj[element['S']] = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.predictionForm.patchValue(patchObj);
      }
      d.push(this.predictionForm.value[element['S']]);
    });

    var data = [];
    data[0] = d;

    // console.log(col_array, data[0], dir_name, model_name, date_cols, user_id, this.modelID)

    this._predictionService
      .xBoostGetPredict(col_array, data[0], dir_name, model_name, date_cols, this.modelID)
      .subscribe((response) => {
        console.log(response)
        this.predictedValue = response['prediction'];
      });
  }


    // Page Navigators
    currentPage: number = 1;
    next(){
      this.currentPage = this.currentPage + 1;
    }
  
    previous(){
      this.predictedValue = null
      this.currentPage = this.currentPage - 1;
    }

}
