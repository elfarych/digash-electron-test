import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DepthMapService } from './depth-map.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepthMapResolver implements Resolve<boolean> {
  constructor(private service: DepthMapService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    this.service.loadPsychology();
    return of(true);
  }
}
