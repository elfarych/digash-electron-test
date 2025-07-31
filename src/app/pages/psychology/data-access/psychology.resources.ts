import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Psychology } from '../../../shared/models/Psychology';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class PsychologyResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadPsychologyItems(): Observable<Psychology[]> {
    return this.http.get<Psychology[]>(`${this.apiGatewayService.getBaseUrl()}/psychology/`);
  }

  public updatePsychologyItem(
    data: Psychology,
    id: number,
  ): Observable<Psychology[]> {
    return this.http.put<Psychology[]>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/${id}/`,
      data,
    );
  }

  public createPsychologyItem(data: Psychology): Observable<Psychology> {
    return this.http.post<Psychology>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/`,
      data,
    );
  }

  public removePsychologyItem(id: number): Observable<Psychology[]> {
    return this.http.delete<Psychology[]>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/${id}/`,
    );
  }

  public activate(id: number): Observable<{}> {
    return this.http.put<{}>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/${id}/activate/`,
      { id },
    );
  }

  public deactivate(id: number): Observable<{}> {
    return this.http.put<{}>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/${id}/deactivate/`,
      { id },
    );
  }

  public psychologyWatched(id: number): Observable<{}> {
    return this.http.put<{}>(
      `${this.apiGatewayService.getBaseUrl()}/psychology/${id}/watched/`,
      { id },
    );
  }
}
