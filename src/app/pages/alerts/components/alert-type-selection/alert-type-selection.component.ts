import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from '../../../../shared/components/menu/menu-trigger.directive';
import { AlertType, AlertTypes } from '../../../../shared/models/Alert';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AppFunctionTooltipIdentifier } from '../../../../shared/components/tooltips/utils/tooltip.model';
import { TooltipsComponent } from '../../../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-type-selection',
  standalone: true,
  imports: [
    CommonModule,
    MenuTriggerDirective,
    AngularSvgIconModule,
    DropdownModule,
    SharedModule,
    FormsModule,
    TooltipsComponent,
    TranslateModule,
  ],
  templateUrl: './alert-type-selection.component.html',
  styleUrls: ['./alert-type-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertTypeSelectionComponent implements OnInit {
  @Input()
  public selectedAlertTypes: AlertType[];

  @Output()
  public alertTypeChanged: EventEmitter<AlertType[]> = new EventEmitter<
    AlertType[]
  >();

  @Input()
  public showLabel = true;

  @Input()
  public multipleSelect = false;

  public alertTooltipIdentifier: AppFunctionTooltipIdentifier =
    'ALERTS_PAGE_ALL_ALERTS';

  private readonly alertTooltipMap = {
    limitOrder: 'ALERTS_PAGE_LIMIT_ORDER_ALERTS',
    priceChange: 'ALERTS_PAGE_PRICE_CHANGE_ALERTS',
    btcCorrelation: 'ALERTS_PAGE_CORRELATION_ALERTS',
    volatility: 'ALERTS_PAGE_VOLATILITY_ALERTS',
    volumeSplash: 'ALERTS_PAGE_VOLUME_SPLASH_ALERTS',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit() {
    // this.setAlertTooltipIdentifier(this.selectedAlertType);
  }

  public get alertTypes() {
    return AlertTypes(this.translateService);
  }

  // private setAlertTooltipIdentifier(alertType: AlertType): void {
  // this.alertTooltipIdentifier = this.alertTooltipMap[alertType];
  // }

  public toggleAlertTypesChange(value: AlertType) {
    if (this.multipleSelect) {
      if (value === 'all') {
        this.alertTypeChanged.emit([]);
        this.cdr.detectChanges();
        return void 0;
      }

      const index = this.selectedAlertTypes.indexOf(value);
      if (index === -1) {
        this.selectedAlertTypes.push(value);
      } else {
        this.selectedAlertTypes.splice(index, 1);
      }
    } else {
      this.selectedAlertTypes = [value];
    }

    this.alertTypeChanged.emit(this.selectedAlertTypes);
    this.cdr.detectChanges();
  }

  public isSelected(value: AlertType): boolean {
    if (value === 'all') {
      return !this.selectedAlertTypes.length;
    }

    return this.selectedAlertTypes.some((alertType) => alertType === value);
  }
}
