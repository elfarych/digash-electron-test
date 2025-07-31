import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../../auth/data-access/auth.service";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UnauthorizedGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getIsAuth().pipe(
      tap(isAuth => isAuth ? void 0 : this.authService.openAuthPopup('register')),
    )
  }
}
