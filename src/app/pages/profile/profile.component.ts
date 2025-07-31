import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { PremiumResources } from '../../shared/components/premium/premium.resources';
import { TelegramSetupComponent } from '../../shared/components/telegram-setup/telegram-setup.component';
import { UserData } from '../../shared/models/Auth';
import { selectUserData } from '../../auth/data-access/auth.selectors';
import { Store } from '@ngrx/store';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { ExchangeKeysSetupComponent } from './exchange-keys-setup/exchange-keys-setup.component';
import { ReferralsFinanceComponent } from './referrals/components/referrals-finance/referrals-finance.component';
import { ReferralsTableComponent } from './referrals/components/referrals-table/referrals-table.component';
import { ReferralsPromoCodesComponent } from './referrals/components/referrals-promo-codes/referrals-promo-codes.component';
import { ReferralsComponent } from './referrals/components/referrals/referrals.component';
import { BitgetProfileComponent } from './bitget-profile/bitget-profile.component';
import { ProfileSettingsExportImportComponent } from './profile-settings-export-import/profile-settings-export-import.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VatagaProfileComponent } from './vataga-profile/vataga-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiGatewayService } from '../../core/http/api-gateway.service';
import { ProfileFriendsComponent } from './profile-friends/profile-friends.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    PanelModule,
    DividerModule,
    BadgeModule,
    ButtonModule,
    TagModule,
    AppGuardComponent,
    ReferralsFinanceComponent,
    ReferralsTableComponent,
    ReferralsPromoCodesComponent,
    ReferralsComponent,
    BitgetProfileComponent,
    ProfileSettingsExportImportComponent,
    TelegramSetupComponent,
    TranslateModule,
    VatagaProfileComponent,
    ExchangeKeysSetupComponent,
    ReactiveFormsModule,
    FormsModule,
    ProfileFriendsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user$: Observable<UserData> = this.store.select(selectUserData);
  public useProxy: boolean = false;

  constructor(
    private store: Store,
    private premiumResources: PremiumResources,
    private translateService: TranslateService,
    private apiGatewayService: ApiGatewayService,
  ) {}

  public ngOnInit(): void {
    if (this.apiGatewayService.getProxyIsUsed()) {
      this.useProxy = true;
    }
  }

  public changeUseProxy(): void {
    this.useProxy
      ? this.apiGatewayService.setProxy()
      : this.apiGatewayService.disableProxy();
    window.location.reload();
  }

  public get locale(): string {
    return this.translateService.currentLang;
  }

  public shouldHide(username: string): boolean {
    return ['digahka', 'admin', 'eldar farych'].includes(
      username.toLowerCase(),
    );
  }

  public async deactivatePartner(): Promise<void> {
    await this.premiumResources.deactivatePartner();
    location.reload();
  }
}
