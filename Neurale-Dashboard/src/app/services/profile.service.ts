import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserData(): Observable<any> {
    var url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/profile';

      const headers = {
        Authorization: localStorage.getItem('IdToken'),
      };
      const requestOptions = {
        headers: new HttpHeaders(headers),
      };

    return this.http.get(url, requestOptions);
  }

  updateUserData(userData: any): Observable<any> {
    var url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/profile';

      const headers = {
        Authorization: localStorage.getItem('IdToken'),
      };
      const requestOptions = {
        headers: new HttpHeaders(headers),
      };

    return this.http.post(url, userData, requestOptions);
  }
}
