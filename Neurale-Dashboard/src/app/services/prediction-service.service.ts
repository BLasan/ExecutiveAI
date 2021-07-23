import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBackend } from '@angular/common/http';
//import CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
//import Hex from 'crypto-js/enc-hex'

@Injectable({
  providedIn: 'root',
})
export class PredictionServiceService {
  constructor(private http: HttpClient, private handler: HttpBackend, private datePipe: DatePipe) {}

  getModelsByCsvName(csvName: string, type: string): Observable<any> {
    const url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getmodels';
    var params = {
      csv_name: csvName,
      type: type,
    };

    let headers = new HttpHeaders().set('Authorization', localStorage.getItem('IdToken'));

    return this.http.get(url, { headers, params });
  }

  trainXGBoostPrediction(x_columns: any, y_columns: any, dateColumns: any, modelName: string, folderName: string, csvName: string, delimiter: string): Observable<any> {
    const url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/trainxgboost';
    var body = {
      x_columns: x_columns,
      y_column: y_columns,
      date_columns: dateColumns,
      folder_name: folderName,
      csv_name: csvName,
      model_name: 'XGBoost',
      delimiter: delimiter
    };

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.post(url, JSON.stringify(body), requestOptions);
  }

  xBoostGetPredict(columns, predictions, dir_name, model_name, date_cols, job_id): Observable<any> {
    var url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getpredctions';
    var body = {
      col_headers: columns,
      data_rows: predictions,
      dir_name: dir_name,
      model_name: model_name,
      date_cols: date_cols,
      job_id: job_id,
    };

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.post(url, JSON.stringify(body), requestOptions);
  }

  getJobStatus(): Observable<any> {
    var url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/jobstatus';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.get(url, requestOptions);
  }
}
