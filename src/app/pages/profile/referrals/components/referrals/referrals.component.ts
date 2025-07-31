import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {PanelModule} from 'primeng/panel';
import {ProfileReferral, ReferralCoupon, ReferralDataPeriod, Withdraw,} from '../../utils/models/referrals.model';
import {Observable} from 'rxjs';
import {ReferralsFinanceComponent} from '../referrals-finance/referrals-finance.component';
import {ReferralsPromoCodesComponent} from '../referrals-promo-codes/referrals-promo-codes.component';
import {ReferralsService} from './referrals.service';
import {UserData} from '../../../../../shared/models/Auth';
import {Action} from "@ngrx/store";
import { ReferralsTableComponent } from '../referrals-table/referrals-table.component';

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    PanelModule,
    NgIf,
    AsyncPipe,
    ReferralsFinanceComponent,
    ReferralsPromoCodesComponent,
    ReferralsTableComponent
  ],
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralsComponent implements OnInit {
  public user$: Observable<UserData> = this.service.getUser();

  public periodRevenue$: Observable<number> = this.service.getPeriodRevenue();

  public periodCompletedWithdraw$: Observable<number> =
    this.service.getPeriodCompletedWithdraw();

  public periodInWorkWithdraw$: Observable<number> =
    this.service.getPeriodInWorkWithdraw();

  public referrals$: Observable<ProfileReferral[]> =
    this.service.getReferrals();

  public coupons$: Observable<ReferralCoupon[]> = this.service.getCoupons();
  public selectedDataPeriod: ReferralDataPeriod = 'today';
  public withdraws$: Observable<Withdraw[]> = this.service.getWithdraws();
  public getCloseEditCouponDialog$: Observable<Action> = this.service.getCloseEditCouponDialog();

  constructor(private service: ReferralsService) {
  }

  public ngOnInit() {
    this.loadReferrals(this.selectedDataPeriod);
    this.loadCoupons();
    this.loadWithdraws(this.selectedDataPeriod);
  }


  public createCoupon(data: ReferralCoupon): void {
    this.service.createCoupon(data);
  }

  public updateCoupon(data: ReferralCoupon): void {
    this.service.updateCoupon(data);
  }

  public removeCoupon(id: number): void {
    this.service.removeCoupon(id);
  }

  public changeSelectedDataPeriodHandler(period: ReferralDataPeriod): void {
    this.selectedDataPeriod = period;
    this.loadReferrals(period);
    this.loadWithdraws(period);
  }

  public createWithdraw(data: Withdraw): void {
    this.service.createWithdraw(data);
  }

  private loadReferrals(period: ReferralDataPeriod): void {
    this.service.loadReferrals(period);
  }

  private loadWithdraws(period: ReferralDataPeriod): void {
    this.service.loadWithdraw(period);
  }

  private loadCoupons(): void {
    this.service.loadCoupons();
  }
}
