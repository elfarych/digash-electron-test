import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatIconModule } from '@angular/material/icon';
import { CoinData } from '../../../../models/CoinData';
import { Formations, getFormationLabel } from '../../../../models/Formations';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-formation-info',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    SvgIconComponent,
    MatIconModule,
    TooltipModule,
  ],
  templateUrl: './formation-info.component.html',
  styleUrls: ['./formation-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormationInfoComponent implements OnChanges {
  @Input()
  public coinData: CoinData;

  @Input()
  public formation: Formations;

  public tooltip: string;

  constructor(private translateService: TranslateService) {}

  public ngOnChanges({ coinData }: SimpleChanges): void {
    if (coinData) {
      this.constructTooltip();
    }
  }

  private constructTooltip(): void {
    if (!this.formation) {
      return void 0;
    }

    this.tooltip = `Обнаружена формация - ${getFormationLabel(this.formation, this.translateService)}`;
  }
}
