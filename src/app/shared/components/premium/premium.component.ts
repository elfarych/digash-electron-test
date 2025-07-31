import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { StyleClassModule } from 'primeng/styleclass';
import { PremiumPeriod } from '../../models/PremiumPeriod';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { PremiumTableComponent } from './components/premium-table/premium-table.component';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/data-access/auth.service';
import { PremiumResources } from './premium.resources';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import {
  comparisonTable0,
  comparisonTable1,
  comparisonTable2,
  comparisonTable3,
  comparisonTable4,
  comparisonTable5,
  comparisonTable6,
  comparisonTable7,
} from './comparisonTable1';
import { TagModule } from 'primeng/tag';
import { ScrollTopModule } from 'primeng/scrolltop';
import { InputTextModule } from 'primeng/inputtext';
import { Promocode } from '../../models/Promocode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { FreePremiumDialogComponent } from '../free-premium-dialog/free-premium-dialog.component';
import { getFunctionNameByCoupon } from './utils/getFunctionNameByCoupon';
import { UserData } from '../../models/Auth';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { PriceList } from './utils/PriceList';
import {PremiumLoyaltyBlockComponent} from "./components/premium-loyalty-block/premium-loyalty-block.component";

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    StyleClassModule,
    BlockUIModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    ScrollTopModule,
    InputTextModule,
    PremiumTableComponent,
    TranslateModule,
    ProgressSpinnerComponent,
    ReactiveFormsModule,
    PremiumLoyaltyBlockComponent,
  ],
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paymentEl', { static: false })
  public paymentEl: ElementRef;

  public termsAgreed: boolean = false;
  public translatedTerms: SafeHtml;

  public selectedPeriod: PremiumPeriod = '12month';
  public blockTmpl = false;
  public blockYearTmpl = false;

  public processed = false;
  public isAuth$: Observable<boolean> = this.authService.getIsAuth();
  public userData$: Observable<UserData> = this.authService.getUserData();
  public premiumIsActive$ = this.authService.getPremiumIsActive();
  public premiumPackage$ = this.authService.getPremiumPackage();
  public premiumDueDate$ = this.authService.getPremiumDueDate();
  public errorMessage: string;
  public errorMessageTerms: string;

  public promoCodeLoading = false;
  public promoCode: Promocode;
  public promoCodeInput: string;
  public promoCodeError: string;

  public comparisonTableData0 = comparisonTable0(this.translateService);
  public comparisonTableData = comparisonTable1(this.translateService);
  public comparisonTableData2 = comparisonTable2(this.translateService);
  public comparisonTableData3 = comparisonTable3(this.translateService);
  public comparisonTableData4 = comparisonTable4(this.translateService);
  public comparisonTableData5 = comparisonTable5(this.translateService);
  public comparisonTableData6 = comparisonTable6(this.translateService);
  public comparisonTableData7 = comparisonTable7(this.translateService);

  public userData: UserData;

  public starterPackageItems = [
    {
      label: this.translateService.instant('premium.access_screener'),
      iconClass: 'pi pi-check icon',
      description: this.translateService.instant('premium.limited'),
    },
    {
      label: this.translateService.instant('premium.coin_data'),
      iconClass: 'pi pi-check icon',
      description: this.translateService.instant('premium.limited'),
    },
    {
      label: this.translateService.instant('premium.price_alerts'),
      iconClass: 'pi pi-check icon',
      description: this.translateService.instant('premium.alerts_count', {
        count: 5,
      }),
    },
    {
      label: this.translateService.instant('premium.listings'),
      iconClass: 'pi pi-check icon',
      description: '',
    },
    {
      label: this.translateService.instant('premium.advanced_alerts'),
      iconClass: 'pi pi-times icon',
      description: '',
    },
    {
      label: this.translateService.instant('premium.density_map'),
      iconClass: 'pi pi-times icon',
      description: '',
    },
    {
      label: this.translateService.instant('premium.psychology_section_access'),
      iconClass: 'pi pi-times icon',
      description: '',
    },
    {
      label: this.translateService.instant('premium.automatic_levels'),
      iconClass: 'pi pi-times icon',
      description: '',
    },
  ];

  public premiumPackageItems = [
    this.translateService.instant('premium.access_screener'),
    this.translateService.instant('premium.density_map'),
    this.translateService.instant('premium.coins_section_access'),
    this.translateService.instant('premium.psychologyAccess'),
    this.translateService.instant('premium.listings'),
    this.translateService.instant('premium.sorting_types'),
    this.translateService.instant('premium.automatic_levels'),
    this.translateService.instant('premium.advanced_alerts'),
  ];

  public priceList: PriceList[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private resources: PremiumResources,
    private dialogService: DialogService,
    private router: Router,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer,
  ) {
    this.subscriptions.add(
      this.userData$.subscribe((userData) => (this.userData = userData)),
    );

    this.subscriptions.add(
      this.translateService.onLangChange.subscribe(() => {
        this.setTerms();

        this.comparisonTableData0 = comparisonTable0(this.translateService);
        this.comparisonTableData = comparisonTable1(this.translateService);
        this.comparisonTableData2 = comparisonTable2(this.translateService);
        this.comparisonTableData3 = comparisonTable3(this.translateService);
        this.comparisonTableData4 = comparisonTable4(this.translateService);
        this.comparisonTableData5 = comparisonTable5(this.translateService);
        this.comparisonTableData6 = comparisonTable6(this.translateService);
        this.comparisonTableData7 = comparisonTable7(this.translateService);

        this.starterPackageItems = [
          {
            label: this.translateService.instant('premium.access_screener'),
            iconClass: 'pi pi-check icon',
            description: this.translateService.instant('premium.workspaces', {
              count: 3,
            }),
          },
          {
            label: this.translateService.instant('premium.favorite_coins'),
            iconClass: 'pi pi-check icon',
            description: this.translateService.instant(
              'premium.fav_coins_limit',
              { count: 5 },
            ),
          },
          {
            label: this.translateService.instant('premium.price_cross_alerts'),
            iconClass: 'pi pi-check icon',
            description: this.translateService.instant('premium.alerts_limit', {
              count: 5,
            }),
          },
          {
            label: this.translateService.instant('premium.coin_data'),
            iconClass: 'pi pi-check icon',
            description: '',
          },
          {
            label: this.translateService.instant('premium.full_coin_history'),
            iconClass: 'pi pi-check icon',
            description: '',
          },
          {
            label: this.translateService.instant(
              'premium.coins_section_access',
            ),
            iconClass: 'pi pi-times icon',
            description: '',
          },
          {
            label: this.translateService.instant('premium.advanced_alerts'),
            iconClass: 'pi pi-times icon',
            description: '',
          },
          // {
          //   label: this.translateService.instant(
          //     'premium.psychology_section_access',
          //   ),
          //   iconClass: 'pi pi-times icon',
          //   description: '',
          // },
        ];

        this.premiumPackageItems = [
          this.translateService.instant('premium.access_screener'),
          this.translateService.instant('premium.density_map'),
          this.translateService.instant('premium.coins_section_access'),
          this.translateService.instant('premium.psychology_section_access'),
          this.translateService.instant('premium.advanced_alerts'),
          this.translateService.instant('premium.automatic_levels'),
        ];
      }),
    );
  }

  public ngAfterViewInit(): void {
    this.blockTmpl = false;
    // this.subscriptions.add(
    //   this.authService.getUserData().subscribe((user: UserData) => this.blockTmpl = user.premium_enabled)
    // )
    this.setTerms();
    this.blockYearTmpl = true;
    this.getPriceList();
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get totalPrice(): number {
    const currentPriceList = this.priceList.find(
      (p) => p.period === this.selectedPeriod,
    );
    return currentPriceList?.user_price ?? 0;
  }

  public get selectedPriceList(): PriceList {
    return this.priceList.find((p) => p.period === this.selectedPeriod);
  }

  public changePeriod(period: PremiumPeriod): void {
    this.selectedPeriod = period;
  }

  public async deactivatePartner(): Promise<void> {
    await this.resources.deactivatePartner();
    this.promoCode = null;
    this.getPriceList();
    this.authService.dispatchLoadUserData();
  }

  public async applyPromoCode(): Promise<void> {
    if (!this.promoCodeInput) {
      this.promoCodeError = 'Введите промокод';
      return void 0;
    }

    this.errorMessage = undefined;
    this.promoCode = undefined;
    this.promoCodeLoading = true;

    try {
      this.promoCode = await this.resources.activatePromoCode(
        this.promoCodeInput,
      );
    } catch (e) {
      this.errorMessage =
        e?.error?.error ||
        this.translateService.instant('premium.promo_code_expired');
    }

    if (this.promoCode && this.promoCode.free_days) {
      let message = `${this.translateService.instant('premium.activate_congratulations')} ${this.promoCode.free_days} ${this.translateService.instant('premium.activate_days')}.`;

      // if (this.promoCode.discount) {
      //   message = `Поздравляем! Активирован бесплатный премиум доступ на ${this.promoCode.free_days} дней с последующей скидкой в ${this.promoCode.discount.value}%.`;
      // }

      if (this.promoCode.functions) {
        message += ` ${getFunctionNameByCoupon(this.promoCode.functions)}`;
      }

      this.dialogService.open(FreePremiumDialogComponent, {
        styleClass: 'free-premium-dialog',
        width: '720px',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        showHeader: false,
        closable: true,
        closeOnEscape: true,
        modal: true,
        dismissableMask: true,
        data: { message },
      });
      this.promoCode = undefined;
    }

    this.authService.dispatchLoadUserData();
    this.getPriceList();

    this.promoCodeLoading = false;
    this.cdr.detectChanges();
  }

  public onPromoCodeChange(value: string) {
    this.promoCodeInput = value.toUpperCase();
  }

  public removePromocode(): void {
    this.promoCode = undefined;
    this.promoCodeInput = undefined;
    this.errorMessage = undefined;
    this.getPriceList();
    this.cdr.detectChanges();
  }

  public async payment(): Promise<void> {
    const premiumIsActive = await firstValueFrom(this.premiumIsActive$);
    const premiumPackage = await firstValueFrom(this.premiumPackage$);

    if (premiumIsActive && premiumPackage === 'Pro') {
      return void 0;
    }

    if (!this.termsAgreed) {
      this.errorMessageTerms = this.translateService.instant(
        'premium.terms_error',
      );
      this.cdr.detectChanges();
      return void 0;
    }

    this.processed = true;
    this.errorMessage = undefined;
    let data: { url: string };
    this.cdr.detectChanges();

    try {
      if (this.promoCode?.coupon_code) {
        data = await this.resources.cryptomusPayment(
          this.selectedPeriod,
          this.promoCode?.coupon_code,
        );
      } else if (this.userData.partner_promocode) {
        data = await this.resources.cryptomusPayment(
          this.selectedPeriod,
          this.userData.partner_promocode,
        );
      } else {
        data = await this.resources.cryptomusPayment(
          this.selectedPeriod,
          undefined,
        );
      }
    } catch (e) {
      this.processed = false;
      this.errorMessage = this.translateService.instant(
        'premium.payment_error_message',
      );
      this.cdr.detectChanges();
      return void 0;
    }

    if (data) {
      this.processed = false;
      this.cdr.detectChanges();
      window.open(data.url + '?lang=ru', '_self');
    }
  }

  public openBitget(): void {
    this.router.navigate(['app', 'profile'], { fragment: 'vataga-profile' });
    document.querySelector('.app-container').scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  private async getPriceList(): Promise<void> {
    this.priceList = await this.resources.getPriceList(
      this.promoCode?.coupon_code ?? null,
    );
    this.cdr.detectChanges();
  }

  private async setTerms() {
    const terms = await firstValueFrom(
      this.translateService.get('premium.terms'),
    );
    this.translatedTerms = this.sanitizer.bypassSecurityTrustHtml(terms);
  }
}
