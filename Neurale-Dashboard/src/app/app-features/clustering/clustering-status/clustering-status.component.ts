import { Component, OnInit } from '@angular/core';
import { PredictionServiceService } from 'src/app/services/prediction-service.service';

@Component({
  selector: 'app-clustering-status',
  templateUrl: './clustering-status.component.html',
  styleUrls: ['./clustering-status.component.scss'],
})
export class ClusteringStatusComponent implements OnInit {
  statusArray = [];

  constructor(private _predictionService: PredictionServiceService) {}

  ngOnInit() {
    this._predictionService.getJobStatus().subscribe((response) => {
      console.log(response);
      response['data'].forEach((element) => {
        if (element['type'] === 'kmeans') {
          element['year'] = element['model_name'].split('-')[2];
          element['month'] = element['model_name'].split('-')[3];
          element['date'] = element['model_name'].split('-')[4];
          this.statusArray.push(element);
        }
      });
    });
  }
}
