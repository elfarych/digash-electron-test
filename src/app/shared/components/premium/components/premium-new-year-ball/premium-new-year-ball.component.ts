import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-new-year-ball',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-new-year-ball.component.html',
  styleUrls: ['./premium-new-year-ball.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
})
export class PremiumNewYearBallComponent {
  @Input()
  public imgSrc: string;

  @Input()
  public index: number;

  @Input()
  public styles: Record<string, string> = {};
}
