import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preferences } from '../../../models/Preferences';
import { PreferencesResources } from './preferences.resources';
import { Store } from '@ngrx/store';
import {
  selectPreferences,
  selectPreferencesLoaded,
  selectPreferencesTheme,
} from './preferences.selectors';
import { PreferencesActions } from './preferences.actions';
import { WatchlistService } from '../../../store/watchlist/watchlist.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  public readonly preferences$: Observable<Preferences> =
    this.store.select(selectPreferences);
  public readonly preferencesLoaded$: Observable<boolean> = this.store.select(
    selectPreferencesLoaded,
  );
  public readonly selectPreferencesTheme$: Observable<string> =
    this.store.select(selectPreferencesTheme);

  constructor(
    private resources: PreferencesResources,
    private store: Store,
    private watchlistService: WatchlistService,
  ) {}

  public loadPreferences(): void {
    this.store.dispatch(PreferencesActions.loadPreferences());
  }

  public updatePreferences(data: Preferences): void {
    this.store.dispatch(PreferencesActions.updatePreferences({ data }));
  }

  public getPreferencesAPI(): Observable<Preferences> {
    return this.resources.loadPreferences();
  }

  public updatePreferencesAPI(data: Preferences): Observable<Preferences> {
    return this.resources.updatePreferences(data);
  }

  public clearWatchlist(): void {
    this.watchlistService.clearWatchList();
  }
}
