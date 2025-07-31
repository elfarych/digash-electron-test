import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-user-agreement',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAgreementComponent implements OnInit {
  constructor(private viewportScroller: ViewportScroller) {}

  public ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  public goTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
