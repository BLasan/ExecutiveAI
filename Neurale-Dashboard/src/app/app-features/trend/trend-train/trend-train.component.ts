import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { ElementArrayFinder } from 'protractor';
import { TrendServiceService } from 'src/app/services/trend-service.service';
// import { DataModelService } from 'src/app/services/data-model.service';
// import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-trend-train',
  templateUrl: './trend-train.component.html',
  styleUrls: ['./trend-train.component.scss'],
})
export class TrendTrainComponent implements OnInit {
  csvDataHeads: any[] = [];

  csvSelectorType: string;
  csvName: string;
  folderName: string;
  dataArray: any;
  headerCount: number;
  y_column_selected: any;
  xColumnArray: any[] = [];
  yColumnArray: any[] = [];
  folderArray: any[] = [];
  yController: FormControl = new FormControl();
  xController: FormControl = new FormControl();
  csvDataTypes: any;
  delimiter: string;

  constructor(
    private route: ActivatedRoute,
    private trendService: TrendServiceService
  ) {
    this.route.data.subscribe((data: { folders: any }) => {
      this.folderArray = data.folders.folders;
    });
  }

  ngOnInit(): void {
    this.xController.valueChanges.subscribe((value: any) => {
      this.yColumnArray = this.yColumnArray.filter((y: any) => y !== value);
    });
    this.yController.valueChanges.subscribe((value: any) => {
      this.xColumnArray = this.xColumnArray.filter((x: any) => x !== value);
    });
    // this.yController.setValue(this.yColumnArray)
    // this.xController.setValue(this.xColumnArray);

    // this.csvDataHeads.forEach((head: any) => {
    //   var checkbox = (<HTMLInputElement>document.getElementById(head))
    //   checkbox.addEventListener('change', function(){
    //     if(this.checked) {
    //       console.log(head)

    //     }
    //   })
    // })
  }

  childChange(event) {
    if (event.target.innerText == 'Training') this.csvSelectorType = 'Training';
    if (event.target.innerText == 'Prediction')
      this.csvSelectorType = 'Prediction';
  }

  getCSVName(event: any) {
    this.csvName = event;
  }

  getFolderName(event: any) {
    this.folderName = event;
  }

  getHeaders(event: any) {
    this.csvDataHeads = event;
    this.yColumnArray = event;
    this.xColumnArray = event;
    this.headerCount = this.csvDataHeads.length;
  }

  getDelimiter(event) {
    console.log(event)
    this.delimiter = event
  }

  getDataTypes(event: any){
    this.csvDataTypes = event;
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

  trendsArray: any[] = [];
  combinationsArray: any = [];

  getTrend() {
    let selectedColumns: any[] = new Array();
    this.csvDataHeads.forEach((value: any) => {
      let htmlElement = <HTMLInputElement>document.getElementById(value);
      let isSelected = htmlElement.checked;
      if (isSelected) {
        selectedColumns.push(value);
      }
    });

    this.combinationsArray = [].concat(
      ...selectedColumns.map((v, i) =>
        selectedColumns.slice(i + 1).map((w) => [v, w])
      )
    );

  
    this.combinationsArray.forEach((element) => {
      this.getGraph(element[0], element[1]);
    });
  }

  // getGraph(var_x: String, var_y: String) {
  //   var a = [];
  //   this.trendService.getTrend(this.folderName, this.csvName, var_x, var_y).subscribe((data) => {
  //     console.log(data);
  //     data['dataset'].forEach((element) => {
  //       console.log(element);
  //       a.push({ x: element[0], y: element[1], label: 'test' });
  //     });
  //     this.trendsArray.push([
  //       {
  //         data: a,
  //         label: 'Series A',
  //         pointRadius: 3,
  //       },
  //     ]);
  //   });
  // }

  checkboxSelects: number = 0;
  clickCheckbox() {
    if (this.checkboxSelects <= 4) {
      this.trendsArray = [];
      this.checkboxSelects = 0;
      let selectedColumns: any[] = new Array();
      this.csvDataHeads.forEach((value: any) => {
        let htmlElement = <HTMLInputElement>document.getElementById(value);
        let isSelected = htmlElement.checked;
        if (isSelected) {
          this.checkboxSelects = this.checkboxSelects + 1;
          selectedColumns.push(value);
        }
      });

      this.pairwise(selectedColumns).forEach((element) => {
        let columnDataType = this.csvDataTypes.find(x => x.col_name === element[0]).data_type;
        var x_col = null;
        var y_col = null;
        if (columnDataType === 'datetime64[ns]') {
          x_col = element[0];
          y_col = element[1];
        } else {
          x_col = element[1];
          y_col = element[0];
        }
        console.log(x_col, y_col)
        this.getGraph(x_col, y_col);
      });
    } else {
      console.log('Select less than 4');
    }

    // Create Possibilities
    // console.log(this.pairwise(selectedColumns))
  }

  pairwise(list) {
    if (list.length < 2) {
      return [];
    }
    var first = list[0],
      rest = list.slice(1),
      pairs = rest.map((x) => {
        return [first, x];
      });
    return pairs.concat(this.pairwise(rest));
  }

  xColumn: any = [];
  yColumn: any = [];
  displayGraph: boolean = false;
  gradient: any;
  yIntercept: any;
  getGraph(var_x: String, var_y: String) {
    var a = [];
    this.trendService
      .getTrend(this.folderName, this.csvName, var_x, var_y, this.delimiter)
      .subscribe((data) => {
        console.log(data);

        // this.xColumn = data['data']['last_3_months']['x'];
        // this.yColumn = data['data']['last_3_months']['y'];

        this.lineChartLabels = data['data']['last_3_months']['x'];

        this.displayGraph = true;

        // last_3_months
        var last_3_months_y = [];
        data['data']['last_3_months']['y'].forEach((element) => {
          last_3_months_y.push(element);
        });

        var last_3_months_y_trend = [];
        data['data']['last_3_months']['y_reg'].forEach((element) => {
          last_3_months_y_trend.push(element);
        });

        // last_month
        var last_month_y = [];
        data['data']['last_month']['y'].forEach((element) => {
          last_month_y.push(element);
        });

        var last_month_y_trend = [];
        data['data']['last_month']['y_reg'].forEach((element) => {
          last_month_y_trend.push(element);
        });

        // last_7_days
        var last_7_days_y = [];
        data['data']['last_7_days']['y'].forEach((element) => {
          last_7_days_y.push(element);
        });

        var last_7_days_y_trend = [];
        data['data']['last_7_days']['y_reg'].forEach((element) => {
          last_7_days_y_trend.push(element);
        });

        this.trendsArray.push({
          lineChartData: [
            {
              data: last_3_months_y,
              label: var_y,
              fill: false,
              borderColor: 'red',
            },
            {
              data: last_3_months_y_trend,
              label: 'Trend Line',
              fill: false,
              borderColor: 'blue',
            },
          ],
          lineChartLabels: data['data']['last_3_months']['x'],
        });
        this.trendsArray.push({
          lineChartData: [
            {
              data: last_month_y,
              label: var_y,
              fill: false,
              borderColor: 'red',
            },
            {
              data: last_month_y_trend,
              label: 'Trend Line',
              fill: false,
              borderColor: 'blue',
            },
          ],
          lineChartLabels: data['data']['last_month']['x'],
        });
        this.trendsArray.push({
          lineChartData: [
            {
              data: last_7_days_y,
              label: var_y,
              fill: false,
              borderColor: 'red',
            },
            {
              data: last_7_days_y_trend,
              label: 'Trend Line',
              fill: false,
              borderColor: 'blue',
            },
          ],
          lineChartLabels: data['data']['last_7_days']['x'],
        });
      });

    console.log(this.trendsArray);
  }

  // blockPrevious: boolean = true;
  // blockNext: boolean = false;
  // currentIndex = 0;
  // currentGraph: any = [];
  // previousGraph() {
  //   if (this.currentIndex === 0) {
  //     this.blockPrevious = true;
  //   } else {
  //     this.currentGraph = [];
  //     this.currentIndex = this.currentIndex - 1;
  //     this.getGraph(
  //       this.combinationsArray[this.currentIndex][0],
  //       this.combinationsArray[this.currentIndex][1]
  //     );
  //   }
  // }
  // nextGraph() {
  //   if (this.currentIndex === this.combinationsArray.length) {
  //     this.blockNext = true;
  //   } else {
  //     this.currentGraph = [];
  //     this.currentIndex = this.currentIndex + 1;
  //     this.getGraph(
  //       this.combinationsArray[this.currentIndex][0],
  //       this.combinationsArray[this.currentIndex][1]
  //     );
  //   }
  // }

  // Line graph
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Crude oil prices' },
  // ];

  lineChartLabels: Label[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  // Navigaion
  currentPage: number = 1;
  next() {
    this.currentPage = this.currentPage + 1;
  }

  previous() {
    this.currentPage = this.currentPage - 1;
  }

  getPrediction() {
    this.currentPage = this.currentPage + 1;
  }
}
