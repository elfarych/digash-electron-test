import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReferralsTableComponent } from '../referrals-table/referrals-table.component';
import { ReferralsFacade } from '../../data-access/referrals.facade';
import {
  ProfileReferral,
  ReferralDataPeriod,
  referralsDataPeriodOptions,
  Withdraw,
} from '../../utils/models/referrals.model';
import { UserData } from '../../../../../shared/models/Auth';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { WithdrawsTableComponent } from '../withdraws-table/withdraws-table.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-referrals-finance',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    PanelModule,
    DividerModule,
    TagModule,
    DialogModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    ReferralsTableComponent,
    AsyncPipe,
    MessageModule,
    MessagesModule,
    WithdrawsTableComponent,
    TranslateModule,
  ],
  templateUrl: './referrals-finance.component.html',
  styleUrls: ['./referrals-finance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralsFinanceComponent {
  @Input()
  public user: UserData;

  @Input()
  public referrals: ProfileReferral[] = [];

  @Input()
  public withdraws: Withdraw[] = [];

  @Input()
  public selectedDataPeriod: ReferralDataPeriod = 'today';

  @Input()
  public periodRevenue: number;

  @Input()
  public periodCompletedWithdraw: number;

  @Input()
  public periodInWorkWithdraw: number;

  @Output()
  public changeSelectedDataPeriod: EventEmitter<ReferralDataPeriod> =
    new EventEmitter<ReferralDataPeriod>();

  @Output()
  public createWithdraw: EventEmitter<Withdraw> = new EventEmitter<Withdraw>();

  public dialogVisible = false;
  public formTouched = false;
  public financeDataPeriodOptions = referralsDataPeriodOptions.map((o) => {
    return {
      ...o,
      label: this.translateService.instant(`profile.${o.label}`),
    };
  });

  public form: FormGroup = new FormGroup(
    {
      address: new FormControl('', [Validators.required]),
      sum: new FormControl(0, [Validators.min(10)]),
    },
    { validators: this.checkWithdrawSum() },
  );

  constructor(
    private service: ReferralsFacade,
    private translateService: TranslateService,
  ) {}

  public withdraw(): void {
    this.dialogVisible = true;
  }

  public submit(): void {
    this.formTouched = true;

    if (this.form.valid) {
      this.createWithdraw.emit(this.form.value);
      this.dialogVisible = false;
    }
  }

  public handleDatePeriodChange(event: DropdownChangeEvent): void {
    this.changeSelectedDataPeriod.emit(event.value);
  }

  private checkWithdrawSum(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const sum = group.get('sum')?.value;

      if (sum > this.user?.balance) {
        return {
          validationErrorMessage: `${this.translateService.instant('profile.maxWithdrawAmount')} ${this.user?.balance} USDT`,
        };
      }
      return null;
    };
  }

  protected readonly PrimeIcons = PrimeIcons;
}
