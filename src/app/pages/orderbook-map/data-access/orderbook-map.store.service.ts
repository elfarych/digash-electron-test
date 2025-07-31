import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  OrderbookMapCoinsData,
  OrderbookMapData,
  OrderbookMapSettings,
} from '../utils/models';

import { OrderbookMapActions } from './orderbook-map.actions';
import {
  selectOrderbookMapCoins,
  selectOrderbookMapCoinsData,
  selectOrderbookMapData,
  selectOrderbookMapLoading,
  selectOrderbookMapPageLoading,
  selectOrderbookMapSettings,
} from './orderbook-map.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrderbookMapStoreService {
  constructor(private store: Store) {}

  public loadSettings(): void {
    this.store.dispatch(OrderbookMapActions.loadSettings());
  }

  public loadOrderbookData(): void {
    this.store.dispatch(OrderbookMapActions.loadOrderbookData());
  }

  public updateSettings(data: OrderbookMapSettings): void {
    this.store.dispatch(OrderbookMapActions.updateSettings({ data }));
  }

  public getLoading(): Observable<boolean> {
    return this.store.select(selectOrderbookMapLoading);
  }

  public getPageLoading(): Observable<boolean> {
    return this.store.select(selectOrderbookMapPageLoading);
  }

  public getSettings(): Observable<OrderbookMapSettings> {
    return this.store.select(selectOrderbookMapSettings);
  }

  public getOrderbookMapData(): Observable<OrderbookMapData> {
    return this.store.select(selectOrderbookMapData);
  }

  public getOrderbookMapCoinsData(): Observable<OrderbookMapCoinsData> {
    return this.store.select(selectOrderbookMapCoinsData);
  }

  public getOrderbookMapCoins(): Observable<{ symbol: string }[]> {
    return this.store.select(selectOrderbookMapCoins);
  }
}
