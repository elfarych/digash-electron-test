import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Workspace, WorkspaceApiData } from '../../../shared/models/Workspace';
import { Exchange } from '../../../shared/models/Exchange';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
  providedIn: 'root',
})
export class WorkspaceResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.apiGatewayService.getBaseUrl()}/workspace/`);
  }

  public loadMultipleWorkspace(ids: number[]): Observable<WorkspaceApiData> {
    return this.http.get<WorkspaceApiData>(
      `${this.apiGatewayService.getBaseUrl()}/workspace/multiple/?ids=${ids}`,
    );
  }

  public createWorkspace(data: Workspace): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.apiGatewayService.getBaseUrl()}/workspace/`, data);
  }

  public editWorkspace(data: Workspace): Observable<Workspace[]> {
    return this.http.put<Workspace[]>(
      `${this.apiGatewayService.getBaseUrl()}/workspace/${data.id}/`,
      data,
    );
  }

  public removeWorkspace(id: number): Observable<{}> {
    return this.http.delete<Workspace[]>(
      `${this.apiGatewayService.getBaseUrl()}/workspace/${id}/`,
    );
  }

  public loadExchangeCoins(exchange: Exchange): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiGatewayService.getBaseUrl()}/coins-navigation/exchange-coins/?exchange=${exchange}`,
    );
  }

  public updateWorkspacesSorting(data: number[]): Observable<Workspace[]> {
    return this.http.put<Workspace[]>(
      `${this.apiGatewayService.getBaseUrl()}/workspace/update-workspace-sorting/`,
      data,
    );
  }
}
