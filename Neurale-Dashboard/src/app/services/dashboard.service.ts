import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  addCharts(data: any, chart: any, dashboardId: any, delimiter: string): Observable<any> {
    console.log('Add chart');
    const url = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard/${dashboardId}`;

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    const payload = {
      data: data,
      chart: chart.chartDataArray,
      delimiter: delimiter
    };

    return this.http.post(url, JSON.stringify(payload), requestOptions);
  }

  createDashboard(data: any, delimiter: any): Observable<any> {
    const endpoint = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    const dataObj = {
      data: data,
      delimiter: delimiter
    }

    return this.http.post(endpoint, JSON.stringify(dataObj), requestOptions);
  }

  getDashboardData(id: string): Observable<any> {
    const endpoint = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard/${id}`;

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.get(endpoint, requestOptions);
  }

  getAllDashboards(): Observable<any> {
    const endpoint = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.get(endpoint, requestOptions);
  }

  editDashboardPositions(id: any, data: any): Observable<any> {
    const endpoint = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard/${id}`;
    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    return this.http.patch(endpoint, JSON.stringify(data), requestOptions);
  }

  checkFirstLogin(): Observable<any> {
    const endpoint = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/checkfirstlogin`;
    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    return this.http.get(endpoint, requestOptions);
  }

  // addCharts(data: any, chart: any, dashboardId: any): Observable<any> {
  //   const endpoint = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard/${dashboardId}`;
  //   const headers = {
  //     Authorization: localStorage.getItem('IdToken'),
  //   };
  //   const requestOptions = {
  //     headers: new HttpHeaders(headers),
  //   };

  //   return this.http.post(endpoint, JSON.stringify({'data': data, 'chart': chart}), requestOptions);
  // }

  deleteDashboard(dashboardId: any): Observable<any> {
    const endpoint = `https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/dashboard/${dashboardId}`;
    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    return this.http.delete(endpoint, requestOptions);   
  }
}
