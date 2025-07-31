import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Psychology } from '../../../shared/models/Psychology';

export const PsychologyActions = createActionGroup({
  source: 'Psychology actions',
  events: {
    'Load psychology items': emptyProps(),
    'Load psychology items success': props<{ data: Psychology[] }>(),
    'Load psychology items error': props<{ errorMessage: string }>(),

    'Activate psychology': props<{ id: number }>(),
    'Activate psychology success': props<{ id: number }>(),
    'Activate psychology error': props<{ errorMessage }>(),

    'Deactivate psychology': props<{ id: number }>(),
    'Deactivate psychology success': props<{ id: number }>(),
    'Deactivate psychology error': props<{ errorMessage }>(),

    'Create psychology item': props<{ data: Psychology }>(),
    'Create psychology item success': props<{ data: Psychology }>(),
    'Create psychology item error': props<{ errorMessage: string }>(),

    'Update psychology item': props<{ data: Psychology; id: number }>(),
    'Update psychology item success': props<{ data: Psychology[] }>(),
    'Update psychology item error': props<{ errorMessage: string }>(),

    'Remove psychology item': props<{ id: number }>(),
    'Remove psychology item success': props<{ id: number }>(),
    'Remove psychology item error': props<{ errorMessage: string }>(),

    'Psychology watched': props<{ id: number }>(),
  },
});
