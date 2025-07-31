import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartWithNavigationComponent } from '../../shared/components/chart-with-navigation/chart-with-navigation.component';
import { map, Observable } from 'rxjs';
import { Preferences } from '../../shared/models/Preferences';
import { ChartsViewService } from './charts-view.service';
import { Exchange } from '../../shared/models/Exchange';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';
import { AppGuardComponent } from '../../shared/components/app-guard/app-guard.component';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { ChartTechnicalIndicators } from '../../shared/models/chart-indicators/ChartIndicators';

@Component({
  selector: 'app-charts-view',
  standalone: true,
  imports: [
    CommonModule,
    ChartWithNavigationComponent,
    AppGuardComponent,
    BlockUIModule,
    ButtonModule,
  ],
  templateUrl: './charts-view.component.html',
  styleUrls: ['./charts-view.component.scss'],
})
export class ChartsViewComponent implements AfterViewInit {
  public symbol$: Observable<string> = this.route.params.pipe(
    map((data: Params) => data['symbol']),
  );
  public exchange$: Observable<Exchange> = this.route.params.pipe(
    map((data: Params) => data['exchange']),
  );
  public preferences$: Observable<Preferences> = this.service.getPreferences();
  public isAuth$: Observable<boolean> = this.authService.getIsAuth();
  public isPremium$: Observable<boolean> =
    this.authService.getPremiumIsActive();
  public chartIndicators$: Observable<ChartTechnicalIndicators[]> =
    this.service.getChartIndicators();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ChartsViewService,
    private authService: AuthService,
    private elementRef: ElementRef,
  ) {}

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
  }

  public redirect({
    symbol,
    exchange,
  }: {
    symbol: string;
    exchange: Exchange;
  }): Promise<boolean> {
    return this.router.navigate(['app', 'coins-view', exchange, symbol]);
  }
}
