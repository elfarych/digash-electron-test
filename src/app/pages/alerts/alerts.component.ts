import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { MenuTriggerDirective } from '../../shared/components/menu/menu-trigger.directive';
import { ReadableSoundName } from '../../shared/pipes/readableSoundName';
import { filter, firstValueFrom, Observable, Subscription } from 'rxjs';
import { NotificationsItemComponent } from '../../shared/components/notifications/notifications-item/notifications-item.component';
import { MatBadgeModule } from '@angular/material/badge';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AlertsSettingsFormComponent } from './components/alerts-settings-form/alerts-settings-form.component';
import { AlertsService } from '../../shared/store/alerts/alerts.service';
import { AlertSettings } from '../../shared/models/AlertSettings';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { SvgIconComponent } from 'angular-svg-icon';
import { Alert, AlertType } from '../../shared/models/Alert';
import { AlertsItemComponent } from './components/alerts-list/alerts-item/alerts-item.component';
import { PaginatorModule } from 'primeng/paginator';
import { AlertsListComponent } from './components/alerts-list/alerts-list.component';
import { AlertTypeSelectionComponent } from './components/alert-type-selection/alert-type-selection.component';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { AuthService } from '../../auth/data-access/auth.service';
import { PremiumForbiddenDialogService } from '../../shared/components/premium-forbidden-dialog/premium-forbidden-dialog.service';
import { UserData } from '../../shared/models/Auth';
import { TooltipsComponent } from '../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MenuComponent,
    MenuTriggerDirective,
    ReadableSoundName,
    NotificationsItemComponent,
    MatBadgeModule,
    FooterComponent,
    AlertsSettingsFormComponent,
    ToastModule,
    ButtonModule,
    PanelModule,
    SvgIconComponent,
    AlertsItemComponent,
    PaginatorModule,
    AlertsListComponent,
    AlertTypeSelectionComponent,
    NotificationsComponent,
    ConfirmPopupModule,
    AppGuardComponent,
    TooltipsComponent,
    TranslateModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsComponent implements OnInit, OnDestroy {
  public readonly priceGrossingAlerts$: Observable<Alert[]> =
    this.service.getAlertsByTypes(['price']);
  public readonly listingAlerts$: Observable<Alert[]> =
    this.service.getAlertsByTypes(['listing']);

  public readonly alertSettings$: Observable<AlertSettings> =
    this.service.getAlertSettings();
  public readonly errorMessage$: Observable<string> =
    this.service.getErrorMessage();

  private readonly alertsAllTypes: AlertType[] = [
    'limitOrder',
    'priceChange',
    'volatility',
    'btcCorrelation',
    'volumeSplash',
    'listing',
    'funding',
  ];
  private readonly subscriptions: Subscription = new Subscription();

  public userData$: Observable<UserData> = this.authService.getUserData();
  public alerts$: Observable<Alert[]> = this.service.getAlertsByTypes(
    this.alertsAllTypes,
  );
  public selectedAlertTypes: AlertType[] = [];
  public allAlertsDeleteLoading = false;

  public constructor(
    private service: AlertsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private premiumForbiddenDialogService: PremiumForbiddenDialogService,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.service.loadAlertSettings();

    this.subscriptions.add(
      this.errorMessage$.pipe(filter(Boolean)).subscribe((errorMessage) => {
        console.error(errorMessage);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: this.translateService.instant(
        //     'ERROR_CODES.NOTIFICATION_SETTINGS_ERROR',
        //   ),
        //   detail: errorMessage,
        // });
      }),
    );
  }

  public alertsTypeChanged(types: AlertType[]) {
    this.selectedAlertTypes = types;

    this.alerts$ = this.service.getAlertsByTypes(
      types?.length ? types : this.alertsAllTypes,
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public settingsChanged(settings: AlertSettings): void {
    this.service.updateAlertSettings(settings);
  }

  public async removeInactivePriceAlerts(): Promise<void> {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('alerts.deleteInactiveAlert'),
      message: this.translateService.instant(
        'alerts.deleteInactiveAlertQuestion',
      ),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('alerts.yes'),
      rejectLabel: this.translateService.instant('alerts.cancel'),
      accept: async () => {
        this.allAlertsDeleteLoading = true;
        await this.service.removeInactivePriceAlerts();
        this.allAlertsDeleteLoading = false;
      },
    });
  }

  public async remove(alertId: number): Promise<void> {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('alerts.deleteAlert'),
      message: `${this.translateService.instant('alerts.deleteAlert')}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('alerts.yes'),
      rejectLabel: this.translateService.instant('alerts.cancel'),
      accept: async () => {
        await this.service.remove(alertId);
      },
    });
  }

  public stop(alertId: number): void {
    this.service.deactivate(alertId);
  }

  public activate(alertId: number): void {
    this.service.activate(alertId);
  }

  public async edit(alert: Alert): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        alert.type !== 'listing'
          ? this.translateService.instant(
              'ERROR_CODES.ADVANCED_NOTIFICATIONS_PREMIUM',
            )
          : this.translateService.instant(
              'ERROR_CODES.LISTING_NOTIFICATIONS_PREMIUM',
            ),
      );
      return void 0;
    }

    this.service.openAlertModal(alert, true, 'price');
  }

  public async create(alertType: AlertType | null = null): Promise<void> {
    const userData = await firstValueFrom(this.userData$);
    if (!userData?.premium_enabled) {
      this.premiumForbiddenDialogService.open(
        alertType !== 'listing'
          ? this.translateService.instant(
              'ERROR_CODES.ADVANCED_NOTIFICATIONS_PREMIUM',
            )
          : this.translateService.instant(
              'ERROR_CODES.LISTING_NOTIFICATIONS_PREMIUM',
            ),
      );
      return void 0;
    }

    this.service.openAlertModal(undefined, false, alertType);
  }

  protected readonly PrimeIcons = PrimeIcons;
}
