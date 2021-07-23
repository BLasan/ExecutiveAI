import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CsvSelectorService {
  constructor(private http: HttpClient) {}

  loadCSVData(directory: string, file: string): Observable<any> {
    const apiGatewayUrl =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getcsvdata';

    const headers = {
        Authorization: localStorage.getItem('IdToken'),
    };

    const requestOptions = {
        headers: new HttpHeaders(headers),
    };

    const params = { directory: directory, file: file };
    return this.http.get(apiGatewayUrl, { headers: headers, params: params})
  }

  getUserDirectories(): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getuserfolders';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.get(url, requestOptions);
  }
}
