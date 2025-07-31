import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vataga-terms-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './vataga-terms-dialog.component.html',
  styleUrls: ['./vataga-terms-dialog.component.scss']
})
export class VatagaTermsDialogComponent {
  public navigateToVataga(): void {
    window.open("https://app.vataga.trading/register/?referrer=Digash", "_blank");
  }
}
