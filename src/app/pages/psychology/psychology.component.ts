import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsychologyService } from './data-access/psychology.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Psychology } from '../../shared/models/Psychology';
import { PsychologyItemComponent } from './components/psychology-item/psychology-item.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TelegramSetupComponent } from '../../shared/components/telegram-setup/telegram-setup.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { AuthService } from '../../auth/data-access/auth.service';
import { PremiumForbiddenDialogService } from '../../shared/components/premium-forbidden-dialog/premium-forbidden-dialog.service';
import { UserData } from '../../shared/models/Auth';
import { TooltipsComponent } from '../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-psychology',
  standalone: true,
  imports: [
    CommonModule,
    PsychologyItemComponent,
    ProgressSpinnerComponent,
    MatButtonModule,
    FooterComponent,
    TelegramSetupComponent,
    ConfirmPopupModule,
    ButtonModule,
    AppGuardComponent,
    TooltipsComponent,
    TranslateModule,
  ],
  templateUrl: './psychology.component.html',
  styleUrls: ['./psychology.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsychologyComponent {
  public psychologies$: Observable<Psychology[]> =
    this.service.getPsychologyItems();
  public loading$: Observable<boolean> = this.service.getLoading();
  public userData$: Observable<UserData> = this.authService.getUserData();

  constructor(
    private service: PsychologyService,
    private authService: AuthService,
    private translateService: TranslateService,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
  ) {}

  public async edit(data: Psychology): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        this.translateService.instant('psychology.premium_message'),
      );
      return void 0;
    }

    this.service.openEditPsychologyDialog(data);
  }

  public async create(): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        this.translateService.instant('psychology.premium_message'),
      );
      return void 0;
    }

    this.service.openCreatePsychologyDialog();
  }

  public remove(data: Psychology): void {
    // `Вы уверены что хотите удалить "${psychology.title}"?`, 'Удаление психологии', 'error'
    this.service.initRemovePsychology(data);
  }

  public async activate(data: Psychology): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        this.translateService.instant('psychology.premium_message'),
      );
      return void 0;
    }

    this.service.activate(data.id);
  }

  public async deactivate(data: Psychology): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        this.translateService.instant('psychology.premium_message'),
      );
      return void 0;
    }

    this.service.deactivate(data.id);
  }
}
