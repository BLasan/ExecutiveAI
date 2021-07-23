import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrendServiceService {
  constructor(private http: HttpClient) {}

  getTrend(directory, file, x_column, y_column, delimiter): Observable<any> {
    if (delimiter === ';') {
      delimiter = 'semicolon'
    } else if (delimiter === ',') {
      delimiter = 'comma'
    } else {
      delimiter = 'whitespace'
    }
    var url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/gettrenddatareg';
    var params = {
      directory: directory,
      file: file,
      x: x_column,
      y: y_column,
      delimiter: delimiter
    };
    console.log(params)

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };

    return this.http.get(url, { headers: headers, params: params });
  }
}
