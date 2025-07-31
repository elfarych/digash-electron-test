import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartIndicatorPropFormControlBase } from '../../../../models/chart-indicators/ChartIndicatorsProps';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-settings-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PaginatorModule,
    CheckboxModule,
    ColorPickerModule,
    TranslateModule
  ],
  templateUrl: './chart-settings-question.component.html',
  styleUrls: ['./chart-settings-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartSettingsQuestionComponent {
  @Input()
  public question!: ChartIndicatorPropFormControlBase;

  @Input()
  public form!: FormGroup;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
