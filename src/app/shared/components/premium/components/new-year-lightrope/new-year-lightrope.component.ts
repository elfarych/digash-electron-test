import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-year-lightrope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-year-lightrope.component.html',
  styleUrls: ['./new-year-lightrope.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewYearLightropeComponent {

}
