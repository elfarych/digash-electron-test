import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {Router} from "@angular/router";
import {MessagesModule} from "primeng/messages";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-premium-message-banner',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessagesModule, TranslateModule],
  templateUrl: './premium-message-banner.component.html',
  styleUrls: ['./premium-message-banner.component.scss']
})
export class PremiumMessageBannerComponent {
  @Input()
  public message: string;

  @HostBinding('class.large')
  @Input()
  public large: boolean;

  @Output()
  public redirectHappened: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
    this.redirectHappened.emit();
  }
}
