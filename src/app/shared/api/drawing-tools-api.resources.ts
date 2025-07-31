import {Injectable} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DrawingTool} from '../models/DrawingTool';
import {ApiGatewayService} from "../../core/http/api-gateway.service";
import {IGNORE_INTERCEPTOR} from "../../core/http/error-handling.interceptor";

@Injectable({
  providedIn: 'root',
})
export class DrawingToolsApiResources {
  private drawingTools: { [symbol: string]: DrawingTool[] } = {};
  private drawingToolsLoaded = false;

  constructor(
    private httpClient: HttpClient,
    private apiGatewayService: ApiGatewayService
  ) {
  }

  public loadAllDrawingTools(): Observable<{ [symbol: string]: DrawingTool[] }> {
    if (this.drawingToolsLoaded) {
      return of(this.drawingTools);
    }

    return this.httpClient.get<{
      [symbol: string]: DrawingTool[]
    }>(`${this.apiGatewayService.getBaseUrl()}/drawing-tools/all/`, { context: new HttpContext().set(IGNORE_INTERCEPTOR, true) })
      .pipe(
        tap(data => {
          this.drawingTools = data;
          this.drawingToolsLoaded = true;
        })
      );
  }

  public getDrawingTools(symbol: string): Observable<DrawingTool[]> {
    if (this.drawingToolsLoaded) {
      return of(this.drawingTools[symbol] ?? []);
    }

    return this.httpClient.get<DrawingTool[]>(`${this.apiGatewayService.getBaseUrl()}/drawing-tools?symbol=${symbol}`, { context: new HttpContext().set(IGNORE_INTERCEPTOR, true) })
      .pipe(
        tap(data => this.drawingTools[symbol] = data)
      );
  }

  public saveDrawingTools(data: { symbol: string, data: DrawingTool[] }) {
    return this.httpClient.post<{}>(`${this.apiGatewayService.getBaseUrl()}/drawing-tools/`, data, {context: new HttpContext().set(IGNORE_INTERCEPTOR, true)}).pipe(
      tap(() => {
        this.drawingTools[data.symbol] = data.data;
      })
    );
  }
}
