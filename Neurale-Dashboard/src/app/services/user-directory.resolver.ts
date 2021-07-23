/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Imports */
import { CsvSelectorService } from './csv-selector.service';

@Injectable()
export class UserDirectoryResolver implements Resolve<Object> {

  constructor(private csvSelectorService: CsvSelectorService) {}

  /**
   * Returns the charge data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    //const chargeId = route.paramMap.get('id');
    return this.csvSelectorService.getUserDirectories();
  }

}