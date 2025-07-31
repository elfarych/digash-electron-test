import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Listing } from '../utils/models/listing.model';

export const ListingActions = createActionGroup({
  source: 'Listing actions',
  events: {
    'Load listings': emptyProps(),
    'Load listings success': props<{ data: Listing[] }>(),
    'Load listings error': props<{ errorMessage: string }>(),
  },
});
