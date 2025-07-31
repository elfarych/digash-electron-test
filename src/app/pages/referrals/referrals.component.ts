import { Component } from '@angular/core';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReferralsTableComponent } from '../profile/referrals/components/referrals-table/referrals-table.component';
import { ReferralsFinanceComponent } from '../profile/referrals/components/referrals-finance/referrals-finance.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    AppGuardComponent,
    FooterComponent,
    ReferralsTableComponent,
    ReferralsFinanceComponent,
  ],
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss'],
})
export class ReferralsComponent {}
