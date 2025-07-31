import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {map, Observable, tap} from "rxjs";
import {UserData} from "../models/Auth";
import {PremiumForbiddenDialogService} from "../components/premium-forbidden-dialog/premium-forbidden-dialog.service";
import {AuthService} from "../../auth/data-access/auth.service";

@Injectable({
  providedIn: 'root',
})
export class ForbiddenGuard implements CanActivate {
  constructor(
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private authService: AuthService
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getUserData().pipe(
      tap((userData: UserData) => userData?.premium_enabled ? void 0 : this.premiumForbiddenDialogService.open()),
      map((userData: UserData) => userData?.premium_enabled)
    )
  }
}
