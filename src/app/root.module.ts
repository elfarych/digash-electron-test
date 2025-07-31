import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrderbookMapEffects } from './pages/orderbook-map/data-access/orderbook-map.effects';
import { orderbookMapReducer } from './pages/orderbook-map/data-access/orderbook-map.reducer';

import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';
import { AngularSvgIconModule, provideAngularSvgIcon } from 'angular-svg-icon';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient,
} from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './auth/data-access/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/data-access/auth.effects';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogModule } from '@angular/cdk/dialog';
import { TokenInterceptor } from './auth/data-access/auth.interceptor';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { workspaceReducer } from './pages/charts-screener/data-access/workspace.reducer';
import { WorkspaceEffects } from './pages/charts-screener/data-access/workspace.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CoinsNavigationEffects } from './shared/store/coins-navigation/coins-navigation.effects';
import { coinsNavigationReducer } from './shared/store/coins-navigation/coins-navigation.reducer';
import { MatIconModule } from '@angular/material/icon';
import { preferencesReducer } from './shared/components/preferences/data-access/preferences.reducer';
import { PreferencesEffects } from './shared/components/preferences/data-access/preferences.effects';
import { WatchlistEffects } from './shared/store/watchlist/watchlist.effects';
import { watchlistReducer } from './shared/store/watchlist/watchlist.reducer';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { alertsReducer } from './shared/store/alerts/alerts.reducer';
import { notificationsReducer } from './shared/store/notifications/notification.reducer';
import { AlertsEffects } from './shared/store/alerts/alerts.effects';
import { NotificationsEffects } from './shared/store/notifications/notifications.effects';
import { psychologyReducer } from './pages/psychology/data-access/psychology.reducer';
import { PsychologyEffects } from './pages/psychology/data-access/psychology.effects';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, SharedModule } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

import localeRu from '@angular/common/locales/ru';
import { AuthService } from './auth/data-access/auth.service';
import { filter, Observable, take } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ErrorHandlingInterceptor } from './core/http/error-handling.interceptor';
import { referralsReducer } from './pages/profile/referrals/data-access/referrals.reducer';
import { ReferralsEffects } from './pages/profile/referrals/data-access/referrals.effects';
import { CoinSearchComponent } from './shared/components/coins-search/coin-search.component';
import { listingReducer } from './pages/listing/data-access/listing.reducer';
import { ListingEffects } from './pages/listing/data-access/listing.effects';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { ApiGatewayService } from './core/http/api-gateway.service';
import { UpdateUnreadPostDialogComponent } from './pages/updates/components/update-unread-post-dialog/update-unread-post-dialog.component';
import { PricingSummerDiscountDialogComponent } from './pages/pricing/pricing-summer-discount/pricing-summer-discount-dialog/pricing-summer-discount-dialog.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeRu);

export function initializeApp(
  authService: AuthService,
  translateService: TranslateService,
  apiGatewayService: ApiGatewayService,
): () => Observable<boolean> {
  return (): Observable<boolean> => {
    return new Observable<boolean>((observer) => {
      apiGatewayService.checkAPIStatus().then(() => {
        authService.authInit();

        authService
          .getUserData()
          .pipe(take(2))
          .subscribe((data) => {
            translateService.use(data?.locale ?? 'ru');
          });

        authService
          .getAppInit()
          .pipe(filter(Boolean), take(1))
          .subscribe(() => {
            observer.next(true);
            observer.complete();
          });
      });
    });
  };
}
@NgModule({
  declarations: [RootComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RootRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OverlayModule,
    DialogModule,
    MatIconModule,
    AngularSvgIconModule.forRoot(),
    MatSnackBarModule,
    StoreModule.forRoot(
      {
        auth: authReducer,
        workspace: workspaceReducer,
        coinsNavigation: coinsNavigationReducer,
        preferences: preferencesReducer,
        watchlist: watchlistReducer,
        alerts: alertsReducer,
        notifications: notificationsReducer,
        psychology: psychologyReducer,
        referrals: referralsReducer,
        listing: listingReducer,
        orderbookMap: orderbookMapReducer,
      },
      {},
    ),
    EffectsModule.forRoot([
      AuthEffects,
      WorkspaceEffects,
      CoinsNavigationEffects,
      PreferencesEffects,
      WatchlistEffects,
      AlertsEffects,
      NotificationsEffects,
      PsychologyEffects,
      ReferralsEffects,
      ListingEffects,
      OrderbookMapEffects,
    ]),
    BrowserAnimationsModule,
    MatDialogModule,
    DropdownModule,
    SharedModule,
    ToastModule,
    CoinSearchComponent,
    UpdateUnreadPostDialogComponent,
    PricingSummerDiscountDialogComponent,
  ],
  providers: [
    ApiGatewayService,
    DynamicDialogRef,
    DialogService,
    { provide: LOCALE_ID, useValue: 'ru_RU' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              oneTapEnabled: false,
              prompt: 'consent',
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, TranslateService, ApiGatewayService],
      multi: true,
    },
    provideAngularSvgIcon(),
    MessageService,
  ],
  bootstrap: [RootComponent],
})
export class RootModule {}
