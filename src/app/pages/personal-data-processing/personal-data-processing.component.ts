import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-personal-data-processing',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './personal-data-processing.component.html',
  styleUrls: ['./personal-data-processing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataProcessingComponent {}
