import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../../../shared/models/Workspace';
import { SvgIconComponent } from 'angular-svg-icon';
import { TranslateModule } from '@ngx-translate/core';
import { getExchangeData } from '../../../../shared/models/Exchange';
import { UnauthorizedDirective } from '../../../../shared/directives/unauthorized.directive';
import { WorkspaceTimeframeSelectorComponent } from '../workspace-timeframe-selector/workspace-timeframe-selector.component';
import { Timeframe } from '../../../../shared/models/Timeframe';
import { DragDropModule } from 'primeng/dragdrop';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-workspace-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    TranslateModule,
    UnauthorizedDirective,
    WorkspaceTimeframeSelectorComponent,
    DragDropModule,
    TooltipModule,
  ],
  templateUrl: './workspace-mobile-menu.component.html',
  styleUrls: ['./workspace-mobile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceMobileMenuComponent {
  @Input()
  public workspaces: Workspace[] = [];

  @Input()
  public selectedWorkspaces: Workspace[] = [];

  @Output()
  public removeWorkspace: EventEmitter<Workspace> =
    new EventEmitter<Workspace>();

  @Output()
  public openSettings: EventEmitter<Workspace> = new EventEmitter<Workspace>();

  @Output()
  public selectWorkspace: EventEmitter<{ data: Workspace; event: MouseEvent }> =
    new EventEmitter<{ data: Workspace; event: MouseEvent }>();

  @Output()
  public changeTimeframe: EventEmitter<{
    timeframe: Timeframe;
    workspace: Workspace;
  }> = new EventEmitter<{ timeframe: Timeframe; workspace: Workspace }>();

  @ViewChild('navigationContainer') navigationRef!: ElementRef;

  public showMenu: boolean = false;

  private touchStartY: number = 0;
  private touchStartX: number = 0;

  public get workspace(): Workspace {
    return this.selectedWorkspaces[0];
  }

  public get navigationStyle(): Record<string, string | number> {
    return {
      marginBottom: this.showMenu ? '0px' : '-70vh',
      opacity: this.showMenu ? 1 : 0,
    };
  }

  public toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.showMenu = !this.showMenu;
  }

  public workspaceTrackBy(index: number, value: Workspace): number {
    return value.id;
  }

  public onSelectWorkspace(event: MouseEvent, data: Workspace): void {
    this.showMenu = false;
    this.selectWorkspace.emit({ event, data });
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.navigationRef.nativeElement.contains(
      event.target,
    );
    if (!clickedInside && this.showMenu) {
      console.log('clickedInside');
      this.showMenu = !this.showMenu;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.changedTouches[0].clientY;
    this.touchStartX = event.changedTouches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const deltaY = touchEndY - this.touchStartY;
    const deltaX = touchEndX - this.touchStartX;

    if (Math.abs(deltaY) > 30) {
      if (deltaY < 0 && !this.showMenu) {
        this.showMenu = true;
      }
    }
  }

  protected readonly getExchangeData = getExchangeData;
}
