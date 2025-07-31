import { UserData, UserPreferences } from '../../shared/models/Auth';
import { createReducer, on } from '@ngrx/store';
import { AuthActions, RestoreActions, UserActions } from './auth.actions';
import { PasswordRestoreStages } from '../../shared/models/PasswordRestoreStages';

export interface AuthState {
  refresh: string;
  access: string;
  user?: UserData;
  loading: boolean;
  errorMessage: string;
  preferences: UserPreferences;
  init: boolean;
  passwordRestoreStage: PasswordRestoreStages;
}

const initialPreferencesState: UserPreferences = {
  language: 'en_GB',
  theme: 'dark',
};

const initialState: AuthState = {
  refresh: '',
  access: '',
  user: undefined,
  errorMessage: '',
  loading: false,
  preferences: initialPreferencesState,
  init: false,
  passwordRestoreStage: 'email',
};

export const authReducer = createReducer(
  initialState,

  on(RestoreActions.restoreEmail, (state) => ({
    ...state,
    passwordRestoreStage: 'email',
    loading: true,
    errorMessage: '',
  })),
  on(RestoreActions.restoreEmailSuccess, (state) => ({
    ...state,
    passwordRestoreStage: 'code',
    loading: false,
    errorMessage: '',
  })),
  on(RestoreActions.restoreEmailError, (state, { errorMessage }) => ({
    ...state,
    passwordRestoreStage: 'email',
    errorMessage,
    loading: false,
  })),

  on(RestoreActions.restoreCode, (state) => ({
    ...state,
    passwordRestoreStage: 'code',
    loading: true,
    errorMessage: '',
  })),
  on(RestoreActions.restoreCodeSuccess, (state) => ({
    ...state,
    passwordRestoreStage: 'password',
    loading: false,
    errorMessage: '',
  })),
  on(RestoreActions.restoreCodeError, (state, { errorMessage }) => ({
    ...state,
    passwordRestoreStage: 'code',
    errorMessage,
    loading: false,
  })),

  on(RestoreActions.restoreNewPassword, (state) => ({
    ...state,
    passwordRestoreStage: 'password',
    loading: true,
    errorMessage: '',
  })),
  on(RestoreActions.restoreNewPasswordSuccess, (state) => ({
    ...state,
    passwordRestoreStage: 'finish',
    authStatus: 'login',
    loading: false,
    errorMessage: '',
  })),
  on(RestoreActions.restoreNewPasswordError, (state, { errorMessage }) => ({
    ...state,
    passwordRestoreStage: 'password',
    errorMessage,
    loading: false,
  })),

  on(RestoreActions.reset, (state) => ({
    ...state,
    passwordRestoreStage: 'email',
    errorMessage: '',
  })),

  on(AuthActions.authTryHappened, (state) => ({ ...state, init: true })),
  on(
    AuthActions.setTokens,
    (state, { access, refresh }): AuthState => ({
      ...state,
      access,
      refresh,
      init: true,
    }),
  ),
  on(
    AuthActions.logout,
    (state): AuthState => ({
      ...state,
      access: '',
      refresh: '',
      user: undefined,
      init: true,
    }),
  ),
  on(
    AuthActions.setUser,
    (state, user): AuthState => ({ ...state, user, init: true }),
  ),
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(AuthActions.loginSuccess, (state) => ({ ...state, loading: false })),
  on(AuthActions.loginError, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(AuthActions.setRegisterErrorMessage, (state, { errorMessage }) => {
    return { ...state, loading: false, errorMessage };
  }),
  on(AuthActions.clearErrorMessage, (state) => ({
    ...state,
    errorMessage: '',
  })),

  on(UserActions.getUserPreferencesSuccess, (state, { data }) => {
    return {
      ...state,
      preferences:
        Object.keys(data).length !== 0 ? data : initialPreferencesState,
    };
  }),
  on(UserActions.updateTheme, (state, { data }) => ({
    ...state,
    preferences: { ...state.preferences, theme: data },
  })),
);
