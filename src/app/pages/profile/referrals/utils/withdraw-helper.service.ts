import { Injectable } from '@angular/core';
import { Withdraw } from './models/referrals.model';

@Injectable({ providedIn: 'root' })
export class WithdrawHelperService {
  public getCompletedWithdrawsTotalSum(withdraws: Withdraw[]): number {
    return withdraws
      .filter((withdraw) => withdraw.completed)
      .reduce((acc, withdraw) => acc + withdraw.sum, 0);
  }

  public getInWorkWithdrawsTotalSum(withdraws: Withdraw[]): number {
    return withdraws
      .filter((withdraw) => !withdraw.completed && !withdraw.canceled)
      .reduce((acc, withdraw) => acc + withdraw.sum, 0);
  }
}
