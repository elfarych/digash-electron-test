import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartOfficialTechnicalIndicators,
  ChartTechnicalIndicators,
  getWorkspaceIndicators,
} from '../../../../../../shared/models/chart-indicators/ChartIndicators';
import {
  ChartIndicatorPropFormControlBase,
  ChartIndicatorsProps,
} from '../../../../../../shared/models/chart-indicators/ChartIndicatorsProps';
import { FormGroup } from '@angular/forms';
import { ChartIndicatorsService } from './chart-indicators.service';
import { ChartIndicatorsQuestionComponent } from '../chart-indicators-question/chart-indicators-question.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipsComponent } from '../../../../../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-indicators',
  standalone: true,
  imports: [
    CommonModule,
    ChartIndicatorsQuestionComponent,
    MatIconModule,
    MatTooltipModule,
    ButtonModule,
    DividerModule,
    TooltipsComponent,
    TranslateModule,
  ],
  templateUrl: './chart-indicators.component.html',
  styleUrls: ['./chart-indicators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartIndicatorsComponent implements OnInit, OnDestroy, OnChanges {
  @Output()
  public updateIndicatorsData: EventEmitter<ChartTechnicalIndicators[]> = new EventEmitter<ChartTechnicalIndicators[]>();

  @Input()
  public selectedIndicators: ChartTechnicalIndicators[];

  @Input()
  public premium: boolean;

  public indicators: ChartTechnicalIndicators[] = getWorkspaceIndicators(this.translateService);
  public form: FormGroup;
  public questions: ChartIndicatorPropFormControlBase[];
  public selectedChartIndicator: ChartTechnicalIndicators;
  private subscription: Subscription = new Subscription();

  constructor(
    private service: ChartIndicatorsService,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.selectedChartIndicator = this.selectedIndicators?.length
      ? this.selectedIndicators[0]
      : this.indicators[0];
    this.generateForm();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public ngOnChanges({ selectedIndicators }: SimpleChanges): void {}

  public toggleIndicator(
    event: MouseEvent,
    indicator: ChartTechnicalIndicators,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const selectedIndicators = Array.isArray(this.selectedIndicators)
      ? JSON.parse(JSON.stringify(this.selectedIndicators))
      : [];

    const technicalIndicatorIdx = selectedIndicators.findIndex(
      (selectedIndicator) => selectedIndicator.name === indicator.name,
    );

    if (technicalIndicatorIdx === -1) {
      selectedIndicators.push(indicator);
    } else {
      selectedIndicators.splice(technicalIndicatorIdx, 1);
    }

    this.updateIndicatorsData.emit(selectedIndicators);
  }

  public selectChartIndicator(
    event: MouseEvent,
    indicator: ChartTechnicalIndicators,
  ): void {
    this.selectedChartIndicator = indicator;
    if (!this.indicatorIsSelected(indicator.name)) {
      this.toggleIndicator(event, indicator);
    }

    this.generateForm();
  }

  public indicatorIsSelected(name: ChartOfficialTechnicalIndicators): boolean {
    if (!this.selectedIndicators || !Array.isArray(this.selectedIndicators)) {
      return false;
    }

    return !!this.selectedIndicators?.find(
      (indicator) => indicator.name === name,
    );
  }

  private handleUpdatedData(values): void {
    if (!Array.isArray(this.selectedIndicators)) {
      return void 0;
    }
    const selectedIndicators = JSON.parse(
      JSON.stringify(this.selectedIndicators),
    );

    const technicalIndicator = selectedIndicators.find(
      (indicator) => indicator.name === this.selectedChartIndicator.name,
    );
    if (!technicalIndicator) {
      return void 0;
    }
    technicalIndicator.props =
      this.getFormData() as unknown as ChartIndicatorsProps;

    this.updateIndicatorsData.emit(selectedIndicators);
  }

  private getFormData(): { [key: string]: unknown } {
    const resultForm: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(this.form.getRawValue())) {
      resultForm[key] = isNaN(value as any) ? value : +value;
    }
    return resultForm;
  }

  private generateForm(defaultValues = false): void {
    this.questions = this.service.generateQuestions(
      this.selectedChartIndicator,
      defaultValues,
      this.translateService,
      this.premium
    );
    this.form = this.service.generateForm(this.questions);

    this.subscription.add(
      this.form.valueChanges
        .pipe(debounceTime(500))
        .subscribe((values) => this.handleUpdatedData(values)),
    );
  }
}
