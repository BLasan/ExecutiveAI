import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userData: any = {
    email: null,
    familyName: null,
    givenName: null,
    organization: null,
  };

  constructor(private router: Router) {
    var decodedToken: any = jwt_decode(localStorage.getItem('IdToken'));
    console.log(decodedToken);
    this.userData.email = decodedToken.email;
    this.userData.familyName = decodedToken.family_name;
    this.userData.givenName = decodedToken.given_name;
    this.userData.organization = decodedToken['custom:custom:organization'];
  }

  ngOnInit() {}

  logout(){
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('IdToken');
    localStorage.removeItem('RefreshToken');
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/auth/login']);
  }
}
