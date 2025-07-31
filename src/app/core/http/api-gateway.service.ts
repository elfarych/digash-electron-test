import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiGatewayService {
  private API_URL = environment.baseUrl;
  private PROXY_URL = environment.baseUrlProxy;
  private BASE_URL = environment.baseUrl;
  private proxyIsUsed: boolean;
  private checkInterval = 60 * 10 * 1000;

  constructor(private http: HttpClient) {
    // this.checkAPIStatus();
    // setInterval(() => this.checkAPIStatus(), this.checkInterval);
  }

  public async checkAPIStatus() {
    if (localStorage.getItem('useProxy3')) {
      this.setProxy();
      return void 0;
    }

    this.proxyIsUsed = false;

    try {
      await firstValueFrom(
        this.http.get(`${this.API_URL}/user/ping/`, { responseType: 'text' }),
      );
    } catch (error) {
      this.setProxy();
    }
  }

  public getProxyIsUsed() {
    return this.proxyIsUsed;
  }

  public getBaseUrl(): string {
    return this.API_URL;
  }

  public setProxy(): void {
    // this.API_URL = this.PROXY_URL;
    this.proxyIsUsed = true;
    localStorage.setItem('useProxy3', '1');
  }

  public disableProxy(): void {
    this.API_URL = this.BASE_URL;
    this.proxyIsUsed = false;
    localStorage.removeItem('useProxy3');
  }
}
