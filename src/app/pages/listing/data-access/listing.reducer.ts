import { createReducer, on } from '@ngrx/store';
import { ListingActions } from './listing.actions';
import { Listing } from '../utils/models/listing.model';

export interface ListingsState {
  loading: boolean;
  listings: Listing[];
}

const initialListingState: ListingsState = {
  loading: true,
  listings: [],
};

export const listingReducer = createReducer(
  initialListingState,

  on(ListingActions.loadListings, (state: ListingsState): ListingsState => {
    return {
      ...state,
      loading: true,
    };
  }),

  on(
    ListingActions.loadListingsSuccess,
    (state: ListingsState, { data: listings }): ListingsState => {
      return {
        ...state,
        listings,
      };
    },
  ),

  on(
    ListingActions.loadListingsSuccess,
    ListingActions.loadListingsError,
    (state: ListingsState): ListingsState => {
      return {
        ...state,
        loading: false,
      };
    },
  ),
);
