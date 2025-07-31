import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FooterComponent} from "../../shared/components/footer/footer.component";
import {Router} from "@angular/router";
import {SvgIconComponent} from "angular-svg-icon";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, FooterComponent, SvgIconComponent, TranslateModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSuccessComponent {
  constructor(private router: Router) {
  }

  public navigate(path: string): void {
    this.router.navigate(['app', path])
  }
}
