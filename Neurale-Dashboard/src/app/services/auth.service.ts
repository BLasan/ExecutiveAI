import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private handler: HttpBackend, private jwtHelper: JwtHelperService) {}

  isAuthenticated(): boolean {    
    const token = localStorage.getItem('IdToken');
    return !this.jwtHelper.isTokenExpired(token);
  }

  signup(userSignupData: any): Observable<any> {
    const url = 'https://3seis50tm0.execute-api.us-east-1.amazonaws.com/v1/user-signup';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
    });
    return this.http.post(url, JSON.stringify(userSignupData));
  }

  emailValidator(email: string): Observable<any> {
    const url = 'https://www.validator.pizza/email/' + email;
    return this.http.get(url);
  }

  emailVerification(verificationData: any): Observable<any> {
    const url = 'https://3seis50tm0.execute-api.us-east-1.amazonaws.com/v1/email-verification';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
    });
    return this.http.post(url, JSON.stringify(verificationData));
  }

  login(userSigninData: any): Observable<any> {
    const url = 'https://3seis50tm0.execute-api.us-east-1.amazonaws.com/v1/user-signin';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
    });
    return this.http.post(url, JSON.stringify(userSigninData));
  }

  forgotPassword(emailData: any): Observable<any> {
    const url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/forgotpassword';
    return this.http.post(url, emailData);
  }

  confirmForgotPassword(confirmationData: any): Observable<any> {
    const url = 'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/confirmforgotpassword';
    return this.http.post(url, confirmationData);
  }

}
