import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdatePost, UpdatePostDetail } from './updates.model';
import { ApiGatewayService } from '../../core/http/api-gateway.service';
import { IGNORE_INTERCEPTOR } from '../../core/http/error-handling.interceptor';

@Injectable({ providedIn: 'root' })
export class UpdatesResources {
  constructor(
    private readonly http: HttpClient,
    private apiGatewayService: ApiGatewayService,
  ) {}

  public getPosts(): Observable<UpdatePost[]> {
    return this.http.get<UpdatePost[]>(
      `${this.apiGatewayService.getBaseUrl()}/updates/`,
      {
        context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
      }
    );
  }

  public getPostDetail(id: number | string): Observable<UpdatePostDetail> {
    return this.http.get<UpdatePostDetail>(
      `${this.apiGatewayService.getBaseUrl()}/updates/detail/${id}/`,
      {
        context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
      }
    );
  }

  public getUnreadPost(): Observable<UpdatePostDetail> {
    return this.http.get<UpdatePostDetail>(
      `${this.apiGatewayService.getBaseUrl()}/updates/unread-post/`,
      {
        context: new HttpContext().set(IGNORE_INTERCEPTOR, true),
      },
    );
  }
}
