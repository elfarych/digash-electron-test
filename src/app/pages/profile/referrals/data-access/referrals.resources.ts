import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  ProfileReferral,
  ReferralCoupon,
  Withdraw,
} from '../utils/models/referrals.model';
import {ApiGatewayService} from "../../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class ReferralsResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadReferrals(params: unknown = {}): Observable<ProfileReferral[]> {
    return this.http.get<ProfileReferral[]>(
      `${this.apiGatewayService.getBaseUrl()}/premium/partner-orders/`,
      params,
    );
  }

  public loadCoupons(): Observable<ReferralCoupon[]> {
    return this.http.get<ReferralCoupon[]>(`${this.apiGatewayService.getBaseUrl()}/coupons/`);
  }

  public createCoupon(data: ReferralCoupon): Observable<ReferralCoupon> {
    return this.http.post<ReferralCoupon>(
      `${this.apiGatewayService.getBaseUrl()}/coupons/create/`,
      data,
    );
  }

  public removeCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGatewayService.getBaseUrl()}/coupons/remove/${id}`);
  }

  public updateCoupon(data: ReferralCoupon): Observable<ReferralCoupon> {
    return this.http.patch<ReferralCoupon>(
      `${this.apiGatewayService.getBaseUrl()}/coupons/update/${data.id}/`,
      data,
    );
  }

  public loadWithdraws(params: unknown = {}): Observable<Withdraw[]> {
    return this.http.get<Withdraw[]>(
      `${this.apiGatewayService.getBaseUrl()}/premium/withdraw/`,
      params,
    );
  }

  public createWithdraw(data: Withdraw): Observable<Withdraw> {
    return this.http.post<Withdraw>(
      `${this.apiGatewayService.getBaseUrl()}/premium/withdraw/create/`,
      data,
    );
  }
}
