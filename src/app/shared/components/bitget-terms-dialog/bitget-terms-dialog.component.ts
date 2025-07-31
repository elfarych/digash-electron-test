import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bitget-terms-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './bitget-terms-dialog.component.html',
  styleUrls: ['./bitget-terms-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitgetTermsDialogComponent {
  public navigateToBitget(): void {
    window.open("https://partner.bitget.com/bg/Digash", "_blank");
  }
}
