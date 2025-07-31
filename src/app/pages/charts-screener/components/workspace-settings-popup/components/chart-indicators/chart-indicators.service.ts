import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartTechnicalIndicators } from '../../../../../../shared/models/chart-indicators/ChartIndicators';
import { getTechnicalIndicatorForm } from '../../../../../../shared/utils/getTechnicalIndicatorForm';
import { ChartIndicatorPropFormControlBase } from '../../../../../../shared/models/chart-indicators/ChartIndicatorsProps';
import { getTechnicalIndicatorDefaultProps } from '../../../../../../shared/utils/getTechnicalIndicatorDefaultProps';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ChartIndicatorsService {
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
    defaultValues = false,
    translateService: TranslateService,
    premium: boolean
  ): ChartIndicatorPropFormControlBase[] {
    const questions: ChartIndicatorPropFormControlBase[] = [];

    for (const question of getTechnicalIndicatorForm(chartIndicator, translateService, premium)) {
      if (!defaultValues) {
        let value = chartIndicator.props[question.key];
        if (question.type === 'boolean') {
          value = !!value;
        }
        question.value =
          value ??
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
