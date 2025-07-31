import {Directive, HostListener} from "@angular/core";
import {AuthService} from "../../auth/data-access/auth.service";
import {firstValueFrom} from "rxjs";
import {PremiumForbiddenDialogService} from "../components/premium-forbidden-dialog/premium-forbidden-dialog.service";
import {UserData} from "../models/Auth";

@Directive({
  selector: '[appPremiumForbidden]',
  standalone: true
})
export class PremiumForbiddenDirective {
  constructor(
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private authService: AuthService
  ) {
  }

  @HostListener('mousedown', ['$event'])
  public async handleClick(event: MouseEvent): Promise<void> {
    const user: UserData = await firstValueFrom(this.authService.getUserData());

    if (!user.premium_enabled) {
      event.preventDefault();
      event.stopPropagation();
      this.premiumForbiddenDialogService.open();
    }
  }
}
