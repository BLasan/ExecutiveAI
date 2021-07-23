import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createDashboard(policyData: any): Observable<any> {
    const endpoint = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/updateuserpolicy';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.post(endpoint, JSON.stringify(policyData), requestOptions);
  }
}
