import { Component, OnInit } from '@angular/core';
import { PredictionServiceService } from 'src/app/services/prediction-service.service';

@Component({
  selector: 'app-prediction-status',
  templateUrl: './prediction-status.component.html',
  styleUrls: ['./prediction-status.component.scss'],
})
export class PredictionStatusComponent implements OnInit {
  constructor(private _predictionService: PredictionServiceService) {}

  statusArray = [];
  ngOnInit() {
    this._predictionService.getJobStatus().subscribe((response) => {
      response['data'].forEach((element) => {
        if (element['type'] == 'regression') {
          element['year'] = element['model_name'].split('-')[2];
          element['month'] = element['model_name'].split('-')[3];
          element['date'] = element['model_name'].split('-')[4];
          this.statusArray.push(element);
        }
      });
    });
  }
}
