import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {ApiGatewayService} from "../../../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class LanguageSwitcherResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public updateUserLocale(locale: string): void {
    this.http
      .put<void>(`${this.apiGatewayService.getBaseUrl()}/user/profile/update-locale/`, {
        locale,
      })
      .pipe(take(1))
      .subscribe();
  }
}
