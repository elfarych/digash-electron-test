import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PricingSummerDiscountComponent } from '../pricing-summer-discount.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from '../../../../shared/models/Auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/data-access/auth.service';

@Component({
  selector: 'app-pricing-summer-discount-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    PricingSummerDiscountComponent,
    TranslateModule,
  ],
  templateUrl: './pricing-summer-discount-dialog.component.html',
  styleUrls: ['./pricing-summer-discount-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingSummerDiscountDialogComponent implements OnInit, OnDestroy {
  public showDialog: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    const isSummerSaleDialogViewed: boolean = !!localStorage.getItem(
      'isSummerSaleDialogViewed3',
    );
    this.subscriptions.add(
      this.authService.getUserData().subscribe((user: UserData) => {
        if (user && !isSummerSaleDialogViewed) {
          this.showDialog = true;
          this.cdr.detectChanges();
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onDialogClose(): void {
    this.showDialog = false;
    localStorage.setItem('isSummerSaleDialogViewed3', '1');
  }
}
