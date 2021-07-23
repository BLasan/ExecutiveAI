import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpBackend } from '@angular/common/http';
//import CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
//import Hex from 'crypto-js/enc-hex'
@Injectable({
  providedIn: 'root',
})
export class ClusteringServiceService {
  constructor(private http: HttpClient) {}

  getModelsByCsvName(csvName: string, type: string): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getmodels';

    let headers = new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('IdToken')
    );

    var params = {
      csv_name: csvName,
      type: type,
    };
    return this.http.get(url, { headers, params });
  }

  trainKMeansPrediction(
    x_columns: any,
    dateColumns: any,
    modelName: string,
    folderName: string,
    csvName: string,
    delimiter: string
  ): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/trainkmeans';
    var body = {
      columns: x_columns,
      date_columns: dateColumns,
      folder_name: folderName,
      csv_name: csvName,
      model_name: 'kmeans-model',
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

  kmeansGetPredict(directory, file, model_name): Observable<any> {
    var url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getkmeanscluster';
    var params = {
      directory: directory,
      file: file,
      model_name: model_name,
    };
    
    let headers = new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('IdToken')
    );

    return this.http.get(url, { headers, params });
  }
}
