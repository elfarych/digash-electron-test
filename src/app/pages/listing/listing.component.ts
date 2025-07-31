import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingService } from './listing.service';
import { Listing, ListingOpenChartParams } from './utils/models/listing.model';
import { Observable } from 'rxjs';
import { ListingTableComponent } from './components/listing-table/listing-table.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule, ListingTableComponent, PanelModule, ButtonModule, TranslateModule],
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent implements OnInit {
  public readonly listings$: Observable<Listing[]> = this.service.getListings();
  public dialogListings: Listing[] = [];

  constructor(
    private service: ListingService,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.service.loadListings();
  }

  public navigateToAlerts(): void {
    this.router.navigate(['app', 'alerts']);
  }

  public openChartDialog({ symbol, exchange }: ListingOpenChartParams): void {
    this.service.openChart(symbol, exchange);
  }
}
