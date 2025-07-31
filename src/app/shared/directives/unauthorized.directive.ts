import {Directive, HostListener} from '@angular/core';
import {UnauthorizedPopupService} from "../components/unauthorized-popup/unauthorized-popup.service";
import {AuthService} from "../../auth/data-access/auth.service";
import {firstValueFrom} from "rxjs";

@Directive({
  selector: '[appUnauthorized]',
  standalone: true
})
export class UnauthorizedDirective {
  constructor(
    private unauthorizedPopupService: UnauthorizedPopupService,
    private authService: AuthService
  ) {
  }

  @HostListener('mousedown', ['$event'])
  public async handleClick(event: MouseEvent): Promise<void> {
    const isAuth: boolean = await firstValueFrom(this.authService.getIsAuth());

    if (!isAuth) {
      event.preventDefault();
      event.stopPropagation();
      this.authService.openAuthPopup('register');
    }
  }
}
