import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AppTheme,
  UserData,
  UserPreferences,
  UserToken,
} from '../../shared/models/Auth';
import { SocialUser } from '@abacritt/angularx-social-login';

export const AuthActions = createActionGroup({
  source: 'Auth actions',
  events: {
    'Set tokens': props<UserToken>(),

    'Load user data': emptyProps(),
    'Set user': props<UserData>(),
    'Set user error': props<{ errorMessage: string }>(),

    Login: props<{ username: string; password: string }>(),
    'Login error': props<{ errorMessage: string }>(),
    'Login success': emptyProps(),

    Register: props<{ username: string; password: string; email: string }>(),
    'Register error': props<{ errorMessage: string }>(),
    'Set Register Error Message': props<{ errorMessage: string }>(),
    'Register success': emptyProps(),

    'Auth google': props<{ user: SocialUser }>(),

    'Refresh token': emptyProps(),
    'Refresh token error': props<{ errorMessage: string }>(),
    'Auth try happened': emptyProps(),

    Logout: emptyProps(),

    'Clear error message': emptyProps(),
    'Show banner': props<{ bannerType: string; message: string }>(),

    'Auth init': emptyProps(),
  },
});

export const UserActions = createActionGroup({
  source: 'User actions',
  events: {
    'Get user preferences': emptyProps(),
    'Get user preferences success': props<{ data: UserPreferences }>(),
    'Get user preferences error': emptyProps(),

    'Update theme': props<{ data: AppTheme }>(),
  },
});

export const RestoreActions = createActionGroup({
  source: 'Restore actions',
  events: {
    'Restore email': props<{ email: string }>(),
    'Restore email success': emptyProps(),
    'Restore email error': props<{ errorMessage: string }>(),

    'Restore code': props<{ code: string; email: string }>(),
    'Restore code success': emptyProps(),
    'Restore code error': props<{ errorMessage: string }>(),

    'Restore new password': props<{
      password: string;
      code: string;
      email: string;
    }>(),
    'Restore new password success': emptyProps(),
    'Restore new password error': props<{ errorMessage: string }>(),

    Reset: emptyProps(),
  },
});
