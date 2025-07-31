import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Workspace } from '../../../shared/models/Workspace';
import {
  MultipleWorkSpaceCoins,
  WorkspaceCoins,
} from '../../../shared/models/WorkspaceCoins';

export const WorkspaceStreamActions = createActionGroup({
  source: 'Workspace stream actions',
  events: {
    'Workspace data update': props<{ data: WorkspaceCoins[]; id: number }>(),
  },
});

export const WorkspaceActions = createActionGroup({
  source: 'Workspace actions',
  events: {
    'Load all workspaces': emptyProps(),
    'Load all workspaces success': props<{ data: Workspace[] }>(),
    'Load all workspace error': props<{ errorMessage: string }>(),

    'Clear workspace coins': emptyProps(),

    'Create workspace': props<{ data: Workspace }>(),
    'Create workspace success': props<{ data: Workspace }>(),
    'Create workspace error': props<{ errorMessage: string }>(),

    'Edit workspace': props<{ data: Workspace }>(),
    'Edit workspace success': props<{ data: Workspace }>(),
    'Edit workspace error': props<{ errorMessage: string }>(),

    'Remove workspace': props<{ id: number }>(),
    'Remove workspace success': props<{ id: number }>(),
    'Remove workspace error': props<{ errorMessage: string }>(),

    'Recalculate formations': emptyProps(),

    'Select workspace': props<{ id: number }>(),
    'Select workspace multiple': props<{ id: number }>(),

    'Init workspace': props<{ ids: number[]; showLoading: boolean }>(),
    'Init workspace success': props<{ data: MultipleWorkSpaceCoins }>(),
    'Init workspace error': props<{ errorMessage: string }>(),

    'Update workspaces sorting': props<{ data: number[] }>(),
    'Update workspaces sorting success': props<{ data: Workspace[] }>(),
    'Update workspaces sorting error': props<{ errorMessage: string }>(),

    Reset: emptyProps(),
  },
});
