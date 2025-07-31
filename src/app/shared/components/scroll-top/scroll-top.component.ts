import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTopComponent {
  @Input()
  public element: ElementRef;

  public scrollTop(): void {
    document.querySelector('mat-drawer-content').scrollTo(0, 0);
  }
}
