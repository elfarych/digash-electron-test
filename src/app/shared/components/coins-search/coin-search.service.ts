import { Injectable } from '@angular/core';
import { CoinSearchResources } from './coin-search.resources';
import { CoinModel } from './utils/coin.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinSearchService {
  constructor(private resources: CoinSearchResources) {}

  public async loadCoins(search: string): Promise<CoinModel[]> {
    return firstValueFrom(this.resources.receiveCoins(search));
  }
}
