import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListingsState } from './listing.reducer';

export const listingFeature = createFeatureSelector<ListingsState>('listing');

export const selectListings = createSelector(
  listingFeature,
  (state: ListingsState) => state.listings,
);
