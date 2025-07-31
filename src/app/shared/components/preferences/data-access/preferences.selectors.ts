import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Preferences } from '../../../models/Preferences';

export const preferencesFeature =
  createFeatureSelector<Preferences>('preferences');

export const selectPreferences = createSelector(
  preferencesFeature,
  (state: Preferences) => state,
);

export const selectPreferencesLoaded = createSelector(
  selectPreferences,
  (state: Preferences) => state.loaded,
);

export const selectPreferencesTheme = createSelector(
  selectPreferences,
  (state: Preferences) => state.appColorThemeSrc,
);
