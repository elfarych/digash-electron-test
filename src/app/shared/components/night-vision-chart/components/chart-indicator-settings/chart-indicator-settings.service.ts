import { Injectable } from '@angular/core';
import {
  ChartIndicatorPropFormControlBase,
  ChartIndicatorsProps,
} from '../../../../models/chart-indicators/ChartIndicatorsProps';
import { ChartTechnicalIndicators } from '../../../../models/chart-indicators/ChartIndicators';
import { ChartIndicatorSettingsComponent } from './chart-indicator-settings.component';
import { filter, take } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getTechnicalIndicatorForm } from '../../../../utils/getTechnicalIndicatorForm';
import { getTechnicalIndicatorDefaultProps } from '../../../../utils/getTechnicalIndicatorDefaultProps';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ChartIndicatorSettingsService {
  constructor(private dialog: DialogService) {}

  public open(
    chartIndicator: ChartTechnicalIndicators,
    premium: boolean
  ): Promise<ChartIndicatorsProps> {
    const dialogRef = this.dialog.open(ChartIndicatorSettingsComponent, {
      width: '480px',
      header: chartIndicator.label,
      closable: true,
      modal: true,
      dismissableMask: true,
      data: {
        dialog: true,
        chartIndicator,
        premium
      },
    });

    return new Promise((resolve, reject) => {
      dialogRef.onClose
        .pipe(take(1), filter(Boolean))
        .subscribe((result: ChartIndicatorsProps) => resolve(result));
    });
  }

  public generateForm(
    questions: ChartIndicatorPropFormControlBase[],
  ): FormGroup {
    const group: Map<string, FormControl> = new Map<string, FormControl>();

    for (const question of questions) {
      const value = question.required
        ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
      group.set(question.key, value);
    }

    return new FormGroup(Object.fromEntries(group));
  }

  public generateQuestions(
    chartIndicator: ChartTechnicalIndicators,
    defaultValues: boolean = false,
    translateService: TranslateService,
    premium: boolean
  ): ChartIndicatorPropFormControlBase[] {
    const questions: ChartIndicatorPropFormControlBase[] = [];
    for (const question of getTechnicalIndicatorForm(chartIndicator, translateService, premium)) {
      if (!defaultValues) {
        question.value =
          chartIndicator.props[question.key] ??
          getTechnicalIndicatorDefaultProps(chartIndicator)[question.key];
      } else {
        question.value =
          getTechnicalIndicatorDefaultProps(chartIndicator)[question.key];
      }

      questions.push(new ChartIndicatorPropFormControlBase(question));
    }
    return questions;
  }
}
