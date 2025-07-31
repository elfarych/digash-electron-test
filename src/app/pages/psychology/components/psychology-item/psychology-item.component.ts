import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Psychology } from '../../../../shared/models/Psychology';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-psychology-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ConfirmPopupModule,
    TranslateModule,
  ],
  templateUrl: './psychology-item.component.html',
  styleUrls: ['./psychology-item.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsychologyItemComponent {
  @Input()
  public psychology: Psychology;

  @Output()
  public remove: EventEmitter<Psychology> = new EventEmitter<Psychology>();

  @Output()
  public edit: EventEmitter<Psychology> = new EventEmitter<Psychology>();

  @Output()
  public activate: EventEmitter<Psychology> = new EventEmitter<Psychology>();

  @Output()
  public deactivate: EventEmitter<Psychology> = new EventEmitter<Psychology>();

  constructor(
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
  ) {}

  public get locale(): string {
    return this.translateService.currentLang;
  }

  public handleRemove(event: Event, data: Psychology): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('psychology.deletePsychology'),
      message: `${this.translateService.instant('psychology.deletePsychologyQuestion')} "${data.title}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('psychology.yes'),
      rejectLabel: this.translateService.instant('psychology.cancel'),
      accept: () => {
        this.remove.emit(data);
      },
    });
  }
}
