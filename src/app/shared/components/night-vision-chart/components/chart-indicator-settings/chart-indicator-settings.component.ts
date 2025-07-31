import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSettingsQuestionComponent } from '../chart-settings-question/chart-settings-question.component';
import { FormGroup } from '@angular/forms';
import { ChartIndicatorPropFormControlBase } from '../../../../models/chart-indicators/ChartIndicatorsProps';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChartIndicatorSettingsService } from './chart-indicator-settings.service';
import { ChartTechnicalIndicators } from '../../../../models/chart-indicators/ChartIndicators';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-indicator-settings',
  standalone: true,
  imports: [
    CommonModule,
    ChartSettingsQuestionComponent,
    ToastModule,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './chart-indicator-settings.component.html',
  styleUrls: ['./chart-indicator-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartIndicatorSettingsComponent {
  public form: FormGroup;
  public questions: ChartIndicatorPropFormControlBase[];

  constructor(
    private service: ChartIndicatorSettingsService,
    private dialogRef: DynamicDialogRef,
    private translateService: TranslateService,
    @Optional()
    @Inject(DynamicDialogConfig)
    public data?: {
      data: {
        dialog: true;
        chartIndicator: ChartTechnicalIndicators;
        premium: boolean;
      };
    },
  ) {
    this.generateForm();
  }

  public resetToDefault(): void {
    this.generateForm(true);
  }

  public save(): void {
    this.dialogRef.close(this.getFormData());
  }

  private getFormData(): { [key: string]: unknown } {
    const resultForm: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(this.form.getRawValue())) {
      if (typeof value === 'boolean') {
        resultForm[key] = value;
      } else {
        resultForm[key] = isNaN(value as any) ? value : +value;
      }
    }
    return resultForm;
  }

  private generateForm(defaultValues: boolean = false): void {
    this.questions = this.service.generateQuestions(
      this.data?.data?.chartIndicator,
      defaultValues,
      this.translateService,
      this.data?.data?.premium
    );
    this.form = this.service.generateForm(this.questions);
  }
}
