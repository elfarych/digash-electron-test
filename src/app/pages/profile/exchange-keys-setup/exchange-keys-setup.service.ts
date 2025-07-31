import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { ExchangeKeysSetupResources } from './exchange-keys-setup.resources';
import {
  ExchangeApiConnectResponse,
  ExchangeKeysSetupPayload,
} from './utils/exchange-keys-setup.models';

@Injectable({ providedIn: 'root' })
export class ExchangeKeysSetupService {
  public errorMessage$: Subject<string> = new Subject();

  constructor(private readonly resources: ExchangeKeysSetupResources) {}

  public connectBinanceAccount(
    payload: ExchangeKeysSetupPayload,
  ): Observable<ExchangeApiConnectResponse> {
    this.errorMessage$.next('');
    return this.resources.connectBinanceAccount(payload).pipe(
      map((response) => {
        if ('error' in response) {
          this.errorMessage$.next(String(response['error']));
        }
        return response;
      }),
    );
  }

  public disconnectBinanceAccount(): Observable<{}> {
    return this.resources.deleteBinanceAccount();
  }
}
