import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Injectable({
    providedIn: 'root'
})
export class VatagaRersources {
    constructor(private http: HttpClient, private apiGatewayService: ApiGatewayService) {}

    public connect(uuid: string): Observable<void> {
        return this.http.put<void>(`${this.apiGatewayService.getBaseUrl()}/user/vataga/connect/`, {uuid});
    }

    public balance(): Observable<number> {
        return this.http.get<{balance: string}>(`${this.apiGatewayService.getBaseUrl()}/user/vataga/balance/`).pipe(
            map(({balance}) => parseFloat(balance))
        );
    }
}
