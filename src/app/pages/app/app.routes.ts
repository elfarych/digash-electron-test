import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { PsychologyResolver } from '../psychology/data-access/psychology.resolver';
import { ChartsViewGuard } from '../charts-view/charts-view.guard';
import { UnauthorizedGuard } from '../../shared/guards/unauthorized.guard';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        redirectTo: 'charts-screener',
        path: '',
        pathMatch: 'full',
      },
      {
        path: 'charts-screener',
        loadComponent: () =>
          import('../charts-screener/charts-screener.component').then(
            (component) => component.ChartsScreenerComponent,
          ),
      },
      {
        path: 'coins-view',
        canActivate: [UnauthorizedGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            canActivate: [ChartsViewGuard],
            loadComponent: () =>
              import('../charts-view/charts-view.component').then(
                (component) => component.ChartsViewComponent,
              ),
          },
          {
            path: ':exchange/:symbol',
            canActivate: [ChartsViewGuard],
            loadComponent: () =>
              import('../charts-view/charts-view.component').then(
                (component) => component.ChartsViewComponent,
              ),
          },
        ],
      },
      {
        path: 'depth-map',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../orderbook-map/orderbook-map.component').then(
            (component) => component.OrderbookMapComponent,
          ),
      },

      {
        path: 'orderbook-map',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../orderbook-map/orderbook-map.component').then(
            (component) => component.OrderbookMapComponent,
          ),
      },

      {
        path: 'profile',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../profile/profile.component').then(
            (component) => component.ProfileComponent,
          ),
      },
      {
        path: 'listings',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../listing/listing.component').then(
            (component) => component.ListingComponent,
          ),
      },
      {
        path: 'alerts',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../alerts/alerts.component').then(
            (component) => component.AlertsComponent,
          ),
      },
      {
        path: 'documentation',
        loadComponent: () =>
          import('../docs/docs.component').then(
            (component) => component.DocsComponent,
          ),
      },
      {
        path: 'updates',
        canActivate: [UnauthorizedGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('../updates/updates.component').then(
                (component) => component.UpdatesComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                '../updates/components/updates-post-detail/updates-post-detail.component'
              ).then((component) => component.UpdatesPostDetailComponent),
          },
        ],
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('../contacts/contacts.component').then(
            (component) => component.ContactsComponent,
          ),
      },
      // {
      //   path: 'new-year-premium',
      //   loadComponent: () =>
      //     import('../../shared/components/premium/components/premium-new-year/premium-new-year.component').then(
      //       (component) => component.PremiumNewYearComponent,
      //     ),
      // },
      {
        path: 'premium',
        loadComponent: () =>
          import('../pricing/pricing.component').then(
            (component) => component.PricingComponent,
          ),
      },
      {
        path: 'referrals',
        loadComponent: () =>
          import('../referrals/referrals.component').then(
            (component) => component.ReferralsComponent,
          ),
      },
      {
        path: 'payment-success',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../payment-success/payment-success.component').then(
            (component) => component.PaymentSuccessComponent,
          ),
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import('../profile/profile.component').then(
            (component) => component.ProfileComponent,
          ),
      },
      {
        path: 'psychology',
        resolve: {
          loading: PsychologyResolver,
        },
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../psychology/psychology.component').then(
            (component) => component.PsychologyComponent,
          ),
      },
      {
        path: 'monitoring',
        canActivate: [UnauthorizedGuard],
        loadComponent: () =>
          import('../monitoring/monitoring.component').then(
            (component) => component.MonitoringComponent,
          ),
      },

      {
        path: 'user-agreement',
        loadComponent: () =>
          import('../user-agreement/user-agreement.component').then(
            (component) => component.UserAgreementComponent,
          ),
      },

      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('../privacy-policy/privacy-policy.component').then(
            (component) => component.PrivacyPolicyComponent,
          ),
      },

      {
        path: 'personal-data-processing',
        loadComponent: () =>
          import(
            '../personal-data-processing/personal-data-processing.component'
          ).then((component) => component.PersonalDataProcessingComponent),
      },
    ],
  },
];
