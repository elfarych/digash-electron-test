import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Preferences } from '../../../models/Preferences';
import {ApiGatewayService} from "../../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class PreferencesResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadPreferences(): Observable<Preferences> {
    return this.http.get<Preferences>(
      `${this.apiGatewayService.getBaseUrl()}/user/preferences/`,
    );
  }

  public updatePreferences(data: Preferences): Observable<Preferences> {
    return this.http.put<Preferences>(
      `${this.apiGatewayService.getBaseUrl()}/user/preferences/`,
      data,
    );
  }
}
