import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Preferences } from '../../../models/Preferences';

export const PreferencesActions = createActionGroup({
  source: 'Preferences',
  events: {
    'Load preferences': emptyProps(),
    'Load preferences success': props<{ data: Preferences }>(),
    'Load preferences error': props<{ errorMessage: string }>(),

    'Update preferences': props<{ data: Preferences }>(),
    'Update preferences success': props<{ data: Preferences }>(),
    'Update preferences error': props<{ errorMessage: string }>(),
  },
});
