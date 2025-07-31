import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  DepthMapCoinsData,
  DepthMapData,
  DepthMapSettings,
} from '../utils/models';
import {
  selectDepthMapCoins,
  selectDepthMapCoinsData,
  selectDepthMapData,
  selectDepthMapLoading,
  selectDepthMapSettings,
} from './depth-map.selectors';
import { DepthMapActions } from './depth-map.actions';

@Injectable({
  providedIn: 'root',
})
export class DepthMapStoreService {
  constructor(private store: Store) {}

  public loadSettings(): void {
    this.store.dispatch(DepthMapActions.loadSettings());
  }

  public loadDepthData(): void {
    this.store.dispatch(DepthMapActions.loadDepthData());
  }

  public updateSettings(data: DepthMapSettings): void {
    this.store.dispatch(DepthMapActions.updateSettings({ data }));
  }

  public getLoading(): Observable<boolean> {
    return this.store.select(selectDepthMapLoading);
  }

  public getSettings(): Observable<DepthMapSettings> {
    return this.store.select(selectDepthMapSettings);
  }

  public getDepthData(): Observable<DepthMapData> {
    return this.store.select(selectDepthMapData);
  }

  public getDepthCoinsData(): Observable<DepthMapCoinsData> {
    return this.store.select(selectDepthMapCoinsData);
  }

  public getDepthCoins(): Observable<{ symbol: string }[]> {
    return this.store.select(selectDepthMapCoins);
  }
}
