import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'src/app/models/route-info.model';
import { ROUTES } from './sidebar-routes.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: RouteInfo[] = ROUTES  ;
  constructor() { }

  ngOnInit() {
  }

}
