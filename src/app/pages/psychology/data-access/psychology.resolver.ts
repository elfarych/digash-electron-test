import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { PsychologyService } from './psychology.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PsychologyResolver implements Resolve<boolean> {
  constructor(private service: PsychologyService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    this.service.loadPsychology();
    return of(true);
  }
}
