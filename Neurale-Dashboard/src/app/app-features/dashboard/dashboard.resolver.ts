/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

import { DashboardService } from 'src/app/services/dashboard.service';

@Injectable()
export class DashboardResolver implements Resolve<Object> {

  constructor(private dashboardService: DashboardService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dashboardId = route.paramMap.get('id');
    return this.dashboardService.getDashboardData(dashboardId);
  }

}