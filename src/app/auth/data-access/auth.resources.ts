import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData, UserPreferences, UserToken } from '../../shared/models/Auth';
import { environment } from '../../../environments/environment';
import { SocialUser } from '@abacritt/angularx-social-login';
import {
  getReferralFriendId,
  getReferralId,
} from 'src/app/shared/utils/ReferralLocalStorage';
import { IGNORE_INTERCEPTOR } from '../../core/http/error-handling.interceptor';
import {ApiGatewayService} from "../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class AuthResources {
  constructor(
    private http: HttpClient,
    private apiGatewayService: ApiGatewayService
  ) {}

  public login(username: string, password: string): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.apiGatewayService.getBaseUrl()}/user/login/`, {
      username,
      password,
    });
  }

  public authGoogle(data: SocialUser): Observable<UserToken> {
    return this.http.post<UserToken>(
      `${this.apiGatewayService.getBaseUrl()}/user/google-auth/`,
      {
        ...data,
        partner: getReferralId(),
        referral_friend_id: getReferralFriendId(),
      },
    );
  }

  public register(
    username: string,
    password: string,
    email: string,
  ): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.apiGatewayService.getBaseUrl()}/user/signup/`,
      {
        username,
        password,
        email,
        partner: getReferralId(),
        referral_friend_id: getReferralFriendId(),
      },
    );
  }

  public refresh(refresh: string): Observable<UserToken> {
    return this.http.post<UserToken>(
      `${this.apiGatewayService.getBaseUrl()}/user/token/refresh/`,
      { refresh },
    );
  }

  public verifyToken(access: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiGatewayService.getBaseUrl()}/user/token/verify/`,
      { token: access },
      { context: new HttpContext().set(IGNORE_INTERCEPTOR, true) },
    );
  }

  public restoreEmail(email: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/user/restore-password/email`,
      { email },
    );
  }

  public restoreCode(token: string, email: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/user/restore-password/token`,
      { token, email },
    );
  }

  public restorePassword(
    token: string,
    email: string,
    password: string,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/user/restore-password/new_password`,
      { token, email, password },
    );
  }

  public getUserPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(
      `${this.apiGatewayService.getBaseUrl()}/user/profile/preferences/`,
    );
  }

  public getUserData(): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiGatewayService.getBaseUrl()}/user/profile/`);
  }

  public updateUserPreferences(data: UserPreferences): Observable<void> {
    return this.http.put<void>(
      `${this.apiGatewayService.getBaseUrl()}/user/profile/preferences/`,
      data,
    );
  }
}
