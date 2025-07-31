import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Listing } from '../utils/models/listing.model';
import { environment } from '../../../../environments/environment';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({ providedIn: 'root' })
export class ListingResources {
  constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

  public loadListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiGatewayService.getBaseUrl()}/listings/`);
  }
}
