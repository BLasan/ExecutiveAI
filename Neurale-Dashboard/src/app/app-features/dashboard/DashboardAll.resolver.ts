/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

import { DashboardService } from 'src/app/services/dashboard.service';

@Injectable()
export class DashboardAllResolver implements Resolve<Object> {

  constructor(private dashboardService: DashboardService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dashboardService.getAllDashboards();
  }

}