import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataModelService } from 'src/app/services/data-model.service';
// import { FilesService } from 'src/app/services/files.service';
import { FormControl } from '@angular/forms';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ClusteringServiceService } from 'src/app/services/clustering-service.service';
import { element } from 'protractor';

@Component({
  selector: 'app-clustering-train',
  templateUrl: './clustering-train.component.html',
  styleUrls: ['./clustering-train.component.scss']
})
export class ClusteringTrainComponent implements OnInit {

  ycolumn: string;
  csvSelectorType: string;
  csvName: string;
  folderName: string;
  dataArray: any;
  headerCount: number;
  y_column_selected: any;
  csvDataHeads = ['age', 'income', 'height', 'weight', 'bmi'];
  csvs: ['income.csv', 'profit.csv', 'marketing.csv'];
  dateArray: string[] = [];
  folderArray: any[] = [];
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  constructor(
    private route: ActivatedRoute,
    private clusteringService: ClusteringServiceService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.route.data.subscribe((data: { folders: any }) => {
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

  loadColumn(data: any, index: any) {
    let columnId = parseInt(index, 10);
    return data[columnId];
  }

  modelName: string;
  getModelName(event) {
    this.modelName = event.target.value;
  }

  delimiter: string
  getDelimiter(event) {
    this.delimiter = event
  }

  col_types: any = []
  getColTypes(event) {
    this.col_types = event;
    console.log(this.col_types)
  }

  toppings = new FormControl();

  train() {
    let selectedColumns: any[] = new Array();
    this.csvDataHeads.forEach((value: any) => {
      let htmlElement = <HTMLInputElement>document.getElementById(value);
      let isSelected = htmlElement.checked;
      if (isSelected) {
        selectedColumns.push(value);
      }
    });

    var _dateColumns: any = [];
    selectedColumns.forEach((element: any) => {
      if (this.col_types.some((e: any) => e.col_name === element && e.data_type.includes("datetime"))) {
        _dateColumns.push({"S": element})
      }
    })

    var _selectedColumns: any = [];
    selectedColumns.forEach((element) => {
      _selectedColumns.push({ S: element });
    });

    // var _dateColumns: any = [];
    // if (this.toppings.value != null) {
    //   this.toppings.value.forEach((element) => {
    //     _dateColumns.push({ S: element });
    //   });
    // }

    console.log(_selectedColumns, _dateColumns, this.modelName, this.folderName, this.csvName);

    this.clusteringService
      .trainKMeansPrediction(_selectedColumns, _dateColumns, this.modelName, this.folderName, this.csvName, this.delimiter)
      .subscribe((response: any) => {
        console.log(response);
      });

    this.router.navigate(['/cluster/status']);
  }

  models = [];
  getModels() {
    console.log(this.csvName);
    this.clusteringService.getModelsByCsvName(this.csvName, 'kmeans').subscribe((response) => {
      console.log(response.jobs);
      this.models = response.jobs;
    });
  }

  modelIndex: any;
  selectedModel: any;
  selectModel(modelIndex) {
    this.modelIndex = modelIndex;
    this.selectedModel = this.models[modelIndex];
  }

  csvData: any = [];
  dataLabels: any = [];
  colorLabels: any = [];
  uniqueLabels: any = [];
  graphPlots: ChartDataSets[] = [];
  getClusterCSV() {
    this.clusteringService
      .kmeansGetPredict(this.folderName, this.csvName, this.selectedModel['M']['model_name']['S'])
      .subscribe((response) => {
        response.header_rows.forEach((element) => {
          this.csvData.push({
            x: element[0],
            y: element[1],
            label: element[2],
          });
          this.dataLabels.push(element[2]);
        });
        this.uniqueLabels = [...new Set(this.csvData.map((item) => item.label))];

        console.log(this.uniqueLabels);
        var a: any = [];
        this.uniqueLabels.forEach((e) => {
          this.csvData.forEach((element) => {
            if (element.label === e) {
              a.push(element);
            }
          });
          console.log(a);
          var obj = {
            data: a,
            label: e,
            pointRadius: 3,
            backgroundColor: '#' + Math.random().toString(16).substr(-6),
          };
          this.colorLabels.push({ backgroundColor: '#' + Math.random().toString(16).substr(-6) });
          console.log(obj);
          this.graphPlots.push(obj);
          a = [];
        });
      });
  }

  currentPage: number = 1;
  next(){
    this.currentPage = this.currentPage + 1;
  }

  previous(){
    this.currentPage = this.currentPage - 1;
  }

  // scatter
  scatterChartOptions: ChartOptions = {
    responsive: true,
  };
  scatterChartLabels: Label[] = this.dataLabels;
  scatterColorLabels: Color[] = this.colorLabels;

  scatterChartData: ChartDataSets[] = this.graphPlots;
  scatterChartType: ChartType = 'scatter';

  // events
  chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }
}
