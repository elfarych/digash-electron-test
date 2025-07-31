import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formations, getFormationsList, } from '../../../../../../shared/models/Formations';
import { UserData } from "../../../../../../shared/models/Auth";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-formations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-formations.component.html',
  styleUrls: ['./chart-formations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartFormationsComponent implements OnChanges {
  @Input()
  public selected: Formations;

  @Input()
  public disabled: boolean = false;

  @Input()
  public userData: UserData;

  @Output()
  public formationChange: EventEmitter<Formations> =
    new EventEmitter<Formations>();

  constructor(private translateService: TranslateService) { }

  public formations: { value: Formations; label: string }[] = [];

  public ngOnChanges({ userData }: SimpleChanges): void {
    if (userData) {
      this.formations = getFormationsList(this.userData?.special_functions, this.translateService);
    }
  }
}
