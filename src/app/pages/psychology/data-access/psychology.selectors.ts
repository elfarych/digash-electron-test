import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PsychologyState } from './psychology.reducer';

export const psychologyFeature =
  createFeatureSelector<PsychologyState>('psychology');

export const selectPsychologies = createSelector(
  psychologyFeature,
  (state: PsychologyState) => state.psychologyItems,
);

export const selectPsychologyErrorMessage = createSelector(
  psychologyFeature,
  (state: PsychologyState) => state.errorMessage,
);

export const selectPsychologyLoading = createSelector(
  psychologyFeature,
  (state: PsychologyState) => state.loading,
);
