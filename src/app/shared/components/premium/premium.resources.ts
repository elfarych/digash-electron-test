import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {PremiumPeriod} from '../../models/PremiumPeriod';
import {Promocode} from '../../models/Promocode';
import {PriceList} from './utils/PriceList';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class PremiumResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {
  }

  public cryptomusPayment(
    period: PremiumPeriod,
    code: string,
  ): Promise<{ url: string }> {
    return firstValueFrom(
      this.http.post<{ url: string }>(
        `${this.apiGatewayService.getBaseUrl()}/premium/cryptomus/checkout/`,
        {
          period,
          code,
        },
      ),
    );
  }

  public activatePromoCode(code: string): Promise<Promocode> {
    return firstValueFrom(
      this.http.post<Promocode>(`${this.apiGatewayService.getBaseUrl()}/coupons/activate/`, {
        code,
      }),
    );
  }

  public bitgetPremium(): Observable<void> {
    return this.http.post<void>(
      `${this.apiGatewayService.getBaseUrl()}/premium/bitget/activate/`,
      {},
    );
  }

  public vatagaPremium(): Observable<void> {
    return this.http.post<void>(
      `${this.apiGatewayService.getBaseUrl()}/premium/vataga/activate/`,
      {},
    );
  }

  public deactivatePartner(): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.apiGatewayService.getBaseUrl()}/coupons/deactivate/`),
    );
  }

  public getPriceList(couponCode: string | null): Promise<PriceList[]> {
    const params: Record<string, string> = {};
    if (couponCode) {
      params['promocode'] = couponCode;
    }
    return firstValueFrom(
      this.http.get<PriceList[]>(`${environment.baseUrl}/premium/price-list/`, {
        params,
      }),
    );
  }
}
