import { Injectable } from '@angular/core';
import { AuthResources } from './auth.resources';
import { Observable } from 'rxjs';
import {
  AppTheme,
  AuthStatus,
  UserData,
  UserPreferences,
  UserToken,
} from '../../shared/models/Auth';
import { Store } from '@ngrx/store';
import {
  selectAccessToken,
  selectAppInit,
  selectApplicationTheme,
  selectAuthErrorMessage,
  selectAuthLoading,
  selectIsAuth,
  selectPremiumDueDate,
  selectPremiumIsActive,
  selectPremiumPackage,
  selectRestorePasswordStage,
  selectUserData,
} from './auth.selectors';
import { AuthPopupComponent } from '../components/auth-popup/auth-popup.component';
import { AuthActions, RestoreActions, UserActions } from './auth.actions';
import { SocialUser } from '@abacritt/angularx-social-login';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PasswordRestoreStages } from '../../shared/models/PasswordRestoreStages';
import { CookieService } from 'ngx-cookie-service';
import { PlatformService } from '../../core/platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth$: Observable<boolean> = this.store.select(selectIsAuth);
  private user$: Observable<UserData> = this.store.select(selectUserData);
  private accessToken$: Observable<string> =
    this.store.select(selectAccessToken);
  private authLoading$: Observable<boolean> =
    this.store.select(selectAuthLoading);
  private authErrorMessage$: Observable<string> = this.store.select(
    selectAuthErrorMessage,
  );
  private applicationTheme$: Observable<AppTheme> = this.store.select(
    selectApplicationTheme,
  );
  private init$: Observable<boolean> = this.store.select(selectAppInit);
  private premiumIsActive$: Observable<boolean> = this.store.select(
    selectPremiumIsActive,
  );
  private premiumDueDate$: Observable<Date> =
    this.store.select(selectPremiumDueDate);
  private premiumPackage$: Observable<string> =
    this.store.select(selectPremiumPackage);
  private dialogRef: DynamicDialogRef | undefined;
  private restorePasswordStage$: Observable<PasswordRestoreStages> =
    this.store.select(selectRestorePasswordStage);

  private tokenKey = 'digah-authTokens';

  constructor(
    private authResources: AuthResources,
    private store: Store,
    public dialogService: DialogService,
    private cookieService: CookieService,
    private platformService: PlatformService,
  ) {}

  public getAppInit(): Observable<boolean> {
    return this.init$;
  }

  public getUserPreferences(): Observable<UserPreferences> {
    return this.authResources.getUserPreferences();
  }

  public updateUserPreferences(data: UserPreferences): Observable<void> {
    return this.authResources.updateUserPreferences(data);
  }

  public authGoogle(user: SocialUser): Observable<UserToken> {
    return this.authResources.authGoogle(user);
  }

  public login(username: string, password: string): Observable<UserToken> {
    return this.authResources.login(username, password);
  }

  public authInit() {
    return this.store.dispatch(AuthActions.authInit());
  }

  public register(
    username: string,
    password: string,
    email: string,
  ): Observable<{ status: string; message: string }> {
    return this.authResources.register(username, password, email);
  }

  public refresh(refresh: string): Observable<UserToken> {
    return this.authResources.refresh(refresh);
  }

  public verify(access: string): Observable<void> {
    return this.authResources.verifyToken(access);
  }

  public restoreEmail(email: string): Observable<void> {
    return this.authResources.restoreEmail(email);
  }

  public restoreCode(code: string, email: string): Observable<void> {
    return this.authResources.restoreCode(code, email);
  }

  public restorePassword(
    code: string,
    email: string,
    password: string,
  ): Observable<void> {
    return this.authResources.restorePassword(code, email, password);
  }

  public loadUserData(): Observable<UserData> {
    return this.authResources.getUserData();
  }

  public dispatchLoadUserData(): void {
    this.store.dispatch(AuthActions.loadUserData());
  }

  public dispatchRestoreReset(): void {
    this.store.dispatch(RestoreActions.reset());
  }

  public dispatchRestoreEmailStage(email): void {
    this.store.dispatch(RestoreActions.restoreEmail({ email }));
  }

  public dispatchRestoreCodeStage(code, email): void {
    this.store.dispatch(RestoreActions.restoreCode({ code, email }));
  }

  public dispatchRestorePasswordStage(password, code, email): void {
    this.store.dispatch(
      RestoreActions.restoreNewPassword({ password, code, email }),
    );
  }

  public dispatchLogin(username: string, password: string): void {
    this.store.dispatch(AuthActions.login({ username, password }));
  }

  public dispatchRegister(
    username: string,
    password: string,
    email: string,
  ): void {
    this.store.dispatch(AuthActions.register({ username, password, email }));
  }

  public dispatchGoogleAuth(user: SocialUser): void {
    this.store.dispatch(AuthActions.authGoogle({ user }));
  }

  public dispatchLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  public getIsAuth(): Observable<boolean> {
    return this.isAuth$;
  }

  public getAccessToken(): Observable<string> {
    return this.accessToken$;
  }

  public getRestorePasswordStage(): Observable<PasswordRestoreStages> {
    return this.restorePasswordStage$;
  }

  public getUserData(): Observable<UserData> {
    return this.user$;
  }

  public getAuthLoading(): Observable<boolean> {
    return this.authLoading$;
  }

  public getAuthErrorMessage(): Observable<string> {
    return this.authErrorMessage$;
  }

  public getApplicationTheme(): Observable<AppTheme> {
    return this.applicationTheme$;
  }

  public getPremiumIsActive(): Observable<boolean> {
    return this.premiumIsActive$;
  }

  public getPremiumDueDate(): Observable<Date> {
    return this.premiumDueDate$;
  }

  public getPremiumPackage(): Observable<string> {
    return this.premiumPackage$;
  }

  public updateApplicationTheme(theme: AppTheme): void {
    this.store.dispatch(UserActions.updateTheme({ data: theme }));
  }

  public openAuthPopup(status: AuthStatus = 'login'): void {
    this.dialogRef = this.dialogService.open(AuthPopupComponent, {
      data: { status },
      width: '480px',
      draggable: true,
      modal: true,
      styleClass: 'digah-dialog',
    });
  }

  public closeAuthPopup(): void {
    this.dialogRef.close();
    this.clearErrorMessages();
  }

  public clearErrorMessages(): void {
    this.store.dispatch(AuthActions.clearErrorMessage());
  }

  public setStoreAuthTokens(access: string, refresh: string): void {
    const storeData = JSON.stringify({ access, refresh });
    console.log('setStoreAuthTokens');
    console.log(this.platformService);
    console.log(this.platformService.isElectron);
    if (this.platformService.isElectron) {
      localStorage.setItem(this.tokenKey, storeData);
    } else {
      this.cookieService.set(this.tokenKey, storeData);
    }
  }

  public deleteStoreAuthTokens(): void {
    if (this.platformService.isElectron) {
      localStorage.removeItem(this.tokenKey);
    } else {
      this.cookieService.delete(this.tokenKey);
    }
  }

  public getStoreAuthTokens(): string {
    if (this.platformService.isElectron) {
      return localStorage.getItem(this.tokenKey);
    } else {
      return this.cookieService.get(this.tokenKey);
    }
  }
}
