import { AuthState } from './auth.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserData } from '../../shared/models/Auth';

export const authFeature = createFeatureSelector<AuthState>('auth');

export const selectRestorePasswordStage = createSelector(
  authFeature,
  (state: AuthState) => state.passwordRestoreStage
)

export const selectRefreshToken = createSelector(
  authFeature,
  (state: AuthState) => state.refresh,
);

export const selectAccessToken = createSelector(
  authFeature,
  (state: AuthState) => state.access,
);

export const selectIsAuth = createSelector(
  authFeature,
  (state: AuthState) => !!state.access,
);

export const selectUserData = createSelector(
  authFeature,
  (state: AuthState) => state.user,
);

export const selectUserPreferences = createSelector(
  authFeature,
  (state: AuthState) => state.preferences,
);

export const selectApplicationTheme = createSelector(
  authFeature,
  (state: AuthState) => state.preferences.theme,
);

export const selectAuthLoading = createSelector(
  authFeature,
  (state: AuthState) => state.loading,
);

export const selectAuthErrorMessage = createSelector(
  authFeature,
  (state: AuthState) => state.errorMessage,
);

export const selectAppInit = createSelector(
  authFeature,
  (state: AuthState) => state.init,
);

export const selectPremiumIsActive = createSelector(
  selectUserData,
  (state: UserData) => state?.premium_enabled,
);

export const selectPremiumDueDate = createSelector(
  selectUserData,
  (state: UserData) =>
    state?.premium_due_date ? new Date(state.premium_due_date) : new Date(),
);

export const selectPremiumPackage = createSelector(
  selectUserData,
  (state: UserData) => state?.premium_package
)
