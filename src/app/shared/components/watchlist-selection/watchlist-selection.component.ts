import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MenuTriggerDirective } from '../menu/menu-trigger.directive';
import {
  WatchlistCoin,
  WatchlistColor,
  watchlistColors,
} from '../../models/Watchlist';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { UnauthorizedDirective } from '../../directives/unauthorized.directive';

@Component({
  selector: 'app-watchlist-selection',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    MenuTriggerDirective,
    MatTooltipModule,
    SpeedDialModule,
    OverlayPanelModule,
    UnauthorizedDirective,
  ],
  templateUrl: './watchlist-selection.component.html',
  styleUrls: ['./watchlist-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistSelectionComponent {
  @ViewChild('overlayPanel')
  public overlayPanel: OverlayPanel;

  @Output()
  public handleSelectColor: EventEmitter<WatchlistColor> =
    new EventEmitter<WatchlistColor>();

  @Input()
  public watchlistCoin: WatchlistCoin;

  @Input()
  public hide = false;

  public watchlistColors: WatchlistColor[] = watchlistColors;

  public selectColor(event: MouseEvent, color: WatchlistColor): void {
    event.preventDefault();
    event.stopPropagation();

    this.handleSelectColor.emit(color);
    this.overlayPanel.hide();
  }

  public togglePanel(event: MouseEvent, panel: OverlayPanel): void {
    event.stopPropagation();
    event.preventDefault();
    panel.toggle(event);
  }
}
