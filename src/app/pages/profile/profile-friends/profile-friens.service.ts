import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReferral, UserReferralReward } from './utils/UserReferralReward';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileFriendsService {
  constructor(private readonly http: HttpClient) {}

  public getRewards(): Observable<UserReferralReward[]> {
    return this.http.get<UserReferralReward[]>(
      `${environment.baseUrl}/user/referral/rewards/`,
    );
  }

  public getUserReferrals(): Observable<UserReferral[]> {
    return this.http.get<UserReferral[]>(
      `${environment.baseUrl}/user/referral/user-referrals/`,
    );
  }

  public claimReward(rewardId: number): Observable<{ claimed: boolean }> {
    return this.http.get<{ claimed: boolean }>(
      `${environment.baseUrl}/user/referral/claim/${rewardId}/`,
    );
  }
}
