import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GridsterItem } from 'angular-gridster2';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { CHART_DEFAULT_OPTIONS } from 'src/app/config/chart.config';
import { GRID_OPTIONS } from 'src/app/config/grid.config';
import { CsvSelectorService } from 'src/app/services/csv-selector.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BinarySet, Marshaller } from '@aws/dynamodb-auto-marshaller';
import { ApplicationRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
})
export class DashboardContainerComponent implements OnInit, AfterViewInit {
  // Dashboard related vars
  public options: any;
  public dashboard: Array<any>;
  public dashboardBackup: Array<GridsterItem>;

  // Dataset related
  public folderName: string;
  public csvName: string;
  public columns: any[];

  public addChartPanel = null;

  public chartOptions: ChartOptions = CHART_DEFAULT_OPTIONS;
  public chartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public chartData: number[] = [300, 500, 100];
  public chartType: ChartType = 'pie';
  public chartLegend = true;
  public chartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  public chartTypes = [];

  public selectedChart = null;
  public selectedColumns = [];
  public showColumns = true;
  public showCharts = false;
  public editMode = false;
  dashboardData: any;
  dashboardId: any;
  marshaller: any = new Marshaller();
  chart_data: any[];
  subscription: Subscription = null;
  delimiter: string;

  constructor(
    private dashboardService: DashboardService,
    private csvSelectorService: CsvSelectorService,
    private el: ElementRef,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((data: { dashboardData: any }) => {
      this.dashboardData = data.dashboardData;
      console.log(this.dashboardData);
      this.delimiter = data.dashboardData.delimiter;
      this.chart_data = data.dashboardData.charts;
      console.log('Chart =>', this.chart_data);
    });
    this.dashboardId = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {
    this.addChartPanel = this.el.nativeElement.querySelector('.chatbox');
  }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe((data: { dashboardData: any }) => {
      this.dashboardData = data.dashboardData;
      // console.log(this.dashboardData);
      this.chart_data = data.dashboardData.charts;
      console.log('Chart =>', this.chart_data);
      const dashboardData = [];
      this.chart_data.forEach((chart) => {
        const element = chart.chart;
        const chart_att = this.marshaller.unmarshallItem({ element });
        console.log(chart_att);
        const obj = {
          cols: +chart_att.element.cols.value,
          rows: +chart_att.element.rows.value,
          y: +chart_att.element.y.value,
          x: +chart_att.element.x.value,
          minItemRows: 3,
          minItemCols: 3,
          hasChart: chart_att.element.hasChart,
          data: chart.data,
          chartId: chart_att.element.id,
          chart: {
            data: chart.data,
            labels: chart.labels,
            columns: chart_att.element.chart.columns,
            chartType: chart_att.element.chart.chartType,
            options: this.chartOptions,
            colors: this.chartColors,
            legend: this.chartLegend,
          },
        };
        dashboardData.push(obj);
      });
      this.dashboard = dashboardData;
      console.log(this.dashboard);
    });
    this.dashboardId = this.route.snapshot.paramMap.get('id');
    // TODO: Get dashboard id from params and load respective dashboard

    this.folderName = this.dashboardData.folder_name;
    this.csvName = this.dashboardData.file_name;
    this.csvSelectorService.loadCSVData(this.folderName, this.csvName).subscribe((data) => {
      this.columns = data.data_types;
    });

    this.options = GRID_OPTIONS;

    // this.dashboard = [
    //   { cols: 2, rows: 2, y: 0, x: 2, hasContent: true, content: { title: 'Total Something', count: 78, icon: '' } },
    //   {
    //     cols: 4,
    //     rows: 4,
    //     y: 0,
    //     x: 0,
    //     minItemRows: 3,
    //     minItemCols: 3,
    //     hasChart: true,
    //     data: this.chartData,
    //     chartId: '001',
    //     chart: {
    //       data: this.chartData,
    //       labels: this.chartLabels,
    //       chartType: this.chartType,
    //       options: this.chartOptions,
    //       colors: this.chartColors,
    //       legend: this.chartLegend,
    //     },
    //   }
    // ];
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  // after selecting columns on press next, filter chart type based on columns
  onPressNext() {
    this.showColumns = !this.showColumns;
    this.showCharts = !this.showCharts;
    if (this.selectedColumns.length === 1) {
      if (this.selectedColumns[0].data_type === 'object') {
        this.chartTypes = [
          { name: 'Bar', icon: 'fa fa-bar-chart' },
          { name: 'Pie', icon: 'fa fa-pie-chart' },
        ];
      } else {
        this.chartTypes = [];
      }
    } else if (this.selectedColumns.length === 2) {
      this.chartTypes = [{ name: 'Line', icon: 'fa fa-line-chart' }];
    }
  }

  onPressBack() {
    this.showColumns = !this.showColumns;
    this.showCharts = !this.showCharts;
  }

  selectColumn(event, column) {
    if (event.target.checked === true) {
      if (this.selectedColumns.length === 2) {
        this.selectedColumns.pop();
      }
      this.selectedColumns.push(column);
    } else {
      event.target.checked = false;
      this.selectedColumns.splice(
        this.selectedColumns.findIndex(({ name }) => name === column.name),
        1
      );
    }
  }

  onGenerate() {
    const targetColumns = this.selectedColumns.map((column) => column.col_name);
    const targetChartType = this.selectedChart.name.toLowerCase();
    var data = {
      chart_type: targetChartType,
      columns: targetColumns,
      file_name: this.csvName,
      dir_name: this.folderName,
    };

    var chartDataArray = [
      {
        x: 0,
        y: 0,
        cols: 4,
        rows: 4,
        hasChart: true,
        chart: {
          chartType: targetChartType,
          columns: targetColumns,
          file_name: this.csvName,
          dir_name: this.folderName,
        },
      },
    ];

    var newChart = { chartDataArray };

    this.dashboardService.addCharts(data, this.marshaller.marshallItem(newChart), this.dashboardId, this.delimiter).subscribe((response: any) => {
      console.log(response);
      console.log(this.marshaller.unmarshallItem(response.charts.Attributes.charts.L));
      const charts = this.marshaller.unmarshallItem(response.charts.Attributes.charts.L);
      const temp = [];
      let i = 0;
      for (const key in charts) {
        if (Object.prototype.hasOwnProperty.call(charts, key)) {
          const element = charts[key];
          temp.push(element);
          console.log(element);
          i++;
        }
      }
      const newItem = temp[i - 1];
      console.log(newItem);
      this.selectedColumns = [];
      this.selectedChart = null;
      this.showColumns = true;
      this.showCharts = false;
      const newChart = {
        x: 0,
        y: 0,
        cols: 4,
        rows: 4,
        hasChart: true,
        data: response.data.data,
        chartId: newItem.id,
        chart: {
          data: response.data.data,
          labels: response.data.labels,
          columns: newItem.chart.columns,
          chartType: targetChartType,
          options: this.chartOptions,
          colors: this.chartColors,
          legend: this.chartLegend,
        },
      };
      this.dashboard.push(newChart);
      // TODO: Update dashboard
      // this.dashboardService.addCharts(, this.dashboardId).subscribe((response: any) => {
      //   console.log(response)
      // });
      this.addChartPanel.classList.remove('active');
    });
  }

  startEdit() {
    this.editMode = true;
    this.dashboardBackup = [...this.dashboard];
    this.options.resizable.enabled = true;
    this.options.draggable.enabled = true;
    this.changedOptions();
  }

  saveDashboard() {
    this.editMode = false;
    this.options.resizable.enabled = false;
    this.options.draggable.enabled = false;
    console.log(this.dashboard);
    const passedVal: any[] = [];
    this.dashboard.forEach((data: any) => {
      passedVal.push({
        cols: data.cols,
        hasChart: data.hasChart,
        rows: data.rows,
        x: data.x,
        y: data.y,
        // data: data.data,
        chartId: data.chartId,
        chart: {
          columns: data.chart.columns,
          chartType: data.chart.chartType,
        },
      });
      // if (data.chart.chartType !== 'line') {

      // } else {
      //   passedVal.push({
      //     cols: data.cols,
      //     hasChart: data.hasChart,
      //     minItemCols: data.minItemCols,
      //     minItemRows: data.minItemRows,
      //     row: data.rows,
      //     x: data.x,
      //     y: data.y,
      //     chartId: data.chartId,
      //   });
      // }
    });

    console.log(passedVal);
    const dataObj = {
      dataArray: passedVal,
    };
    const data = this.marshaller.marshallItem(dataObj);
    console.log(data);
    this.dashboardService.editDashboardPositions(this.dashboardId, data).subscribe((response: any) => {
      console.group(response);
    });
    this.changedOptions();
  }

  cancelEdit() {
    this.editMode = false;
    this.options.resizable.enabled = false;
    this.options.draggable.enabled = false;
    this.dashboard = this.dashboardBackup.slice();
    this.changedOptions();
    this.subscription.unsubscribe()
    this.ngOnInit();
  }
}
