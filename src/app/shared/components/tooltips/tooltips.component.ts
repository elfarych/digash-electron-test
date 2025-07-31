import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipsService } from './tooltips.service';
import {
  AppFunctionTooltip,
  AppFunctionTooltipIdentifier,
} from './utils/tooltip.model';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { SpinnerModule } from 'primeng/spinner';
import { ButtonModule } from 'primeng/button';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    PanelModule,
    SkeletonModule,
    SpinnerModule,
    ButtonModule,
  ],
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipsComponent {
  @Input()
  public readonly identifier: AppFunctionTooltipIdentifier;

  @Input()
  public readonly size: number = 12;

  public loading = false;
  public dialogVisible: boolean = false;
  public tooltip: AppFunctionTooltip | null = null;

  constructor(
    private service: TooltipsService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public openTooltipDialog(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.dialogVisible = true;
    this.loadTooltip();
  }

  public get title(): string {
    return (
      this.tooltip?.[`title_${this.translateService.currentLang}`] ??
      this.tooltip.title
    );
  }

  public get content(): string {
    return (
      this.tooltip?.[`content_${this.translateService.currentLang}`] ??
      this.tooltip.content
    );
  }

  public closeTooltipDialog(): void {
    this.dialogVisible = false;
    this.clearTooltip();
  }

  public async loadTooltip(): Promise<void> {
    this.loading = true;
    this.tooltip = await this.service.getTooltip(this.identifier);
    this.loading = false;
    this.cdr.detectChanges();
  }

  public clearTooltip(): void {
    this.tooltip = null;
  }
}
