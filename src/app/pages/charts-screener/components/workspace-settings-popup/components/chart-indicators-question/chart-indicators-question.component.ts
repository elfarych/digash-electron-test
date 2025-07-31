import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartIndicatorPropFormControlBase } from '../../../../../../shared/models/chart-indicators/ChartIndicatorsProps';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-indicators-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    InputNumberModule,
    InputTextModule,
    ColorPickerModule,
    CheckboxModule,
    DropdownModule,
    DividerModule,
    TranslateModule
  ],
  templateUrl: './chart-indicators-question.component.html',
  styleUrls: ['./chart-indicators-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartIndicatorsQuestionComponent implements OnInit {
  @Input()
  public question!: ChartIndicatorPropFormControlBase;

  @Input()
  public form!: FormGroup;

  ngOnInit(): void {}

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
