import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  defaultChartSettings,
  DensitiesWidgetSettings,
  DensitiesWidgetSettingsSorting,
} from '../../models/ChartSettings';
import { convertPrice } from '../../utils/priceConverter';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderComponent } from '../slider/slider.component';
import { BehaviorSubject, debounceTime, skip, Subscription } from 'rxjs';
import { Density } from '../../utils/densities';

@Component({
  selector: 'app-densities-widget',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ToastModule,
    ConfirmPopupModule,
    ContextMenuModule,
    SliderModule,
    FormsModule,
    InputNumberModule,
    ReactiveFormsModule,
    SliderComponent,
    SliderComponent,
  ],
  providers: [MessageService],
  templateUrl: './densities-widget.component.html',
  styleUrls: ['./densities-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DensitiesWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public densities: Density[] = [];

  @Input()
  public settings: DensitiesWidgetSettings;

  @Output()
  public selectDensity: EventEmitter<Density> = new EventEmitter<Density>();

  @Output()
  public closeWidget: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public updateWidgetSettings: EventEmitter<DensitiesWidgetSettings> =
    new EventEmitter<DensitiesWidgetSettings>();

  @ViewChild('cm') cm: ContextMenu;

  public opacity$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public menu: MenuItem[] | undefined = [];

  private minWidgetWidth: number = 310;
  private minWidgetHeight: number = 400;

  private isResizing: boolean = false;
  private initialMouseX = 0;
  private initialMouseY = 0;
  private newWidth = 0;
  private newHeight = 0;

  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private initialBottom = 0;
  private initialLeft = 0;

  private subscriptions: Subscription = new Subscription();

  public constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.setMenuItems();

    this.subscriptions.add(
      this.opacity$.pipe(debounceTime(1000), skip(1)).subscribe((value) => {
        this.updateSettings({ opacity: value });
      }),
    );
  }

  public ngOnChanges({ settings }: SimpleChanges): void {
    if (settings) {
      this.setMenuItems();
    }

    if (settings && settings.isFirstChange()) {
      this.opacity$.next(
        settings.currentValue?.opacity ??
          defaultChartSettings.densitiesWidgetSettings.opacity,
      );
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public get widgetStyle(): Record<string, string | number> {
    const settings =
      this.settings ?? defaultChartSettings.densitiesWidgetSettings;

    const widgetWidth = Math.max(settings.width, this.minWidgetWidth);
    const widgetHeight = Math.max(settings.height, this.minWidgetHeight);
    const collapsedHeight = 40;

    const maxLeft = window.innerWidth - widgetWidth;
    const maxBottom =
      window.innerHeight -
      (settings.collapsed ? collapsedHeight : widgetHeight);

    const left = Math.min(Number(settings.left ?? 16), maxLeft);
    const bottom = Math.min(Number(settings.bottom ?? 16), maxBottom);

    return {
      width: widgetWidth + 'px',
      height: settings.collapsed ? collapsedHeight + 'px' : widgetHeight + 'px',
      left: left + 'px',
      bottom: bottom + 'px',
      '--widget-height': widgetHeight + 'px',
    };
  }

  public collapse(): void {
    this.updateSettings({
      collapsed: !(
        this.settings ?? defaultChartSettings.densitiesWidgetSettings
      ).collapsed,
    });
  }

  public changeOpacity(value: number): void {
    this.opacity$.next(value);
  }

  public changeSorting(sorting: DensitiesWidgetSettingsSorting): void {
    this.updateSettings({ sorting });
  }

  public setDefaultSettings(): void {
    this.updateSettings({
      width: 250,
      height: 250,
      bottom: 16,
      left: 16,
      opacity: 1,
    });
  }

  public onSelect(density: Density): void {
    this.selectDensity.emit(density);
  }

  public onClose(): void {
    this.closeWidget.emit();
  }

  public onContextMenu(event: MouseEvent): void {
    this.cm.show(event);
  }

  public onDragStart(event: MouseEvent): void {
    const widget = document.getElementById('densities-widget-id');
    if (widget) {
      const rect = widget.getBoundingClientRect();
      this.isDragging = true;

      this.dragOffsetX = event.clientX;
      this.dragOffsetY = event.clientY;

      this.initialBottom = window.innerHeight - rect.bottom;
      this.initialLeft = rect.left;
    }
    event.preventDefault();
  }

  public onResizeStart(event: MouseEvent): void {
    this.isResizing = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    event.preventDefault();
  }

  private updateSettings(settings: Partial<DensitiesWidgetSettings>): void {
    this.updateWidgetSettings.emit({
      ...(this.settings ?? defaultChartSettings.densitiesWidgetSettings),
      ...settings,
    });
  }

  private setMenuItems(): void {
    this.menu = [
      {
        label: this.translateService.instant('densitiesWidget.sortByDistance'),
        command: () => this.changeSorting('distance'),
        styleClass: this.settings.sorting === 'distance' ? 'text-primary' : '',
      },
      {
        label: this.translateService.instant('densitiesWidget.sortBySum'),
        command: () => this.changeSorting('size'),
        styleClass: this.settings.sorting === 'size' ? 'text-primary' : '',
      },
      {
        label: this.translateService.instant(
          'densitiesWidget.sortByCorrosionTime',
        ),
        command: () => this.changeSorting('corrosionTime'),
        styleClass:
          this.settings.sorting === 'corrosionTime' ? 'text-primary' : '',
      },

      {
        label: this.translateService.instant(
          'densitiesWidget.closeDensitiesWidget',
        ),
        command: () => this.onClose(),
        badge: this.translateService.instant(
          'densitiesWidget.densitiesWidgetCloseMessage',
        ),
        styleClass: 'mt-md',
      },
    ];
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const dx = event.clientX - this.dragOffsetX;
      const dy = event.clientY - this.dragOffsetY;

      const widget = document.getElementById('densities-widget-id');
      if (!widget) return;

      const newLeft = this.initialLeft + dx;
      const newBottom = this.initialBottom - dy;

      const maxLeft = window.innerWidth - widget.offsetWidth;
      const maxBottom = window.innerHeight - widget.offsetHeight;

      const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
      const clampedBottom = Math.max(0, Math.min(newBottom, maxBottom));

      widget.style.left = `${clampedLeft}px`;
      widget.style.bottom = `${clampedBottom}px`;
    }

    if (this.isResizing) {
      const dx = event.clientX - this.initialMouseX;
      const dy = event.clientY - this.initialMouseY;

      this.newWidth = Math.max(this.settings.width + dx, this.minWidgetWidth);
      this.newHeight = Math.max(
        this.settings.height - dy,
        this.minWidgetHeight,
      );

      const widgetElement = document.getElementById(
        'densities-widget-id',
      ) as HTMLElement;

      if (widgetElement) {
        widgetElement.style.width = `${this.newWidth}px`;
        widgetElement.style.height = `${this.newHeight}px`;
        widgetElement.style.setProperty(
          '--widget-height',
          `${this.newHeight}px`,
        );
      }
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    const widget = document.getElementById('densities-widget-id');

    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    const calculatedBottom = window.innerHeight - rect.bottom;
    const calculatedLeft = rect.left;

    if (this.isDragging || this.isResizing) {
      this.updateSettings({
        width: this.newWidth || this.settings.width,
        height: this.newHeight || this.settings.height,
        left: calculatedLeft,
        bottom: calculatedBottom,
      });
    }

    if (this.isDragging) {
      this.isDragging = false;
    }

    if (this.isResizing) {
      this.isResizing = false;
    }
  }

  protected readonly convertPrice = convertPrice;
}
