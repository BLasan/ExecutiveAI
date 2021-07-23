import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { ClusteringServiceService } from 'src/app/services/clustering-service.service';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-clustering-predict',
  templateUrl: './clustering-predict.component.html',
  styleUrls: ['./clustering-predict.component.scss']
})
export class ClusteringPredictComponent implements OnInit {

  ycolumn: string;
  csvSelectorType: string;
  csvName: string;
  folderName: string;
  dataArray: any;
  headerCount: number;
  y_column_selected: any;
  csvDataHeads = [];
  csvs: [];
  dateArray: string[] = [];
  folderArray: any[] = [];

  constructor(
    private route: ActivatedRoute,
    // private modelService: DataModelService,
    private clusteringServiceService: ClusteringServiceService,
  ) {
    this.route.data.subscribe((data: { folders: any }) => {
      this.folderArray = data.folders.folders;
    });
  }
  ngOnInit() {
  }

  getCSVName(event: any) {
    this.csvName = event;
  }

  getFolderName(event: any) {
    this.folderName = event;
  }

  modelIndex: any;
  selectedModel: any;
  selectModel(modelIndex) {
    this.modelIndex = modelIndex;
    this.selectedModel = this.models[modelIndex];
    this.getClusterCSV()
  }

  csvData: any = [];
  dataLabels: any = [];
  colorLabels: any = [];
  uniqueLabels: any = [];
  graphPlots: ChartDataSets[] = [];
  getClusterCSV() {
    this.clusteringServiceService
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

        console.log(this.uniqueLabels)

        var a: any = [];
        this.uniqueLabels.forEach((e) => {
          this.csvData.forEach((element) => {
            if (element.label === e) {
              a.push(element);
            }
          });
          var obj = {
            data: a,
            label: e,
            pointRadius: 3,
            backgroundColor: '#' + Math.random().toString(16).substr(-6),
          };
          console.log(obj)
          this.colorLabels.push({ backgroundColor: '#' + Math.random().toString(16).substr(-6) });
          this.graphPlots.push(obj);
          a = [];
        });
      });
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

  models = [];
  jobs_unavailable:boolean = false
  getModels() {
    this.clusteringServiceService.getModelsByCsvName(this.csvName, 'kmeans').subscribe((response) => {
      console.log(response)
      if(response['message'] == 'success'){
        response.jobs.forEach(element => {
          if(!(element["M"]["job_status"]["S"] == "Failed")){
            this.models.push(element)
          }
        });
      }else{
        //  response['message'] == 'jobs_unavailable'
        this.jobs_unavailable = true
      }
    });
  }

  currentPage: number = 1;
  next(){
    this.currentPage = this.currentPage + 1;
  }

  previous(){
    this.currentPage = this.currentPage - 1;
  }

  getPrediction(){
    this.currentPage = this.currentPage + 1;
  }

    // scatter
    scatterChartOptions: ChartOptions = {
      responsive: true,
    };
    scatterChartLabels: Label[] = this.dataLabels;
    scatterColorLabels: Color[] = this.colorLabels;
  
    // scatterChartData: ChartDataSets[] = this.graphPlots;
    scatterChartType: ChartType = 'scatter';
  
    // events
    chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    }
  
    chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    }

}
