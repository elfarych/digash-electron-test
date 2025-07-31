import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {Router} from "@angular/router";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-premium-forbidden-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './premium-forbidden-dialog.component.html',
  styleUrls: ['./premium-forbidden-dialog.component.scss']
})
export class PremiumForbiddenDialogComponent {
  constructor(
    private router: Router,
    private dialogRef: DynamicDialogRef,
    @Inject(DynamicDialogConfig)
    public data: { data: { message: 'Данная функция открывается в премиум доступе' } },
  ) {
  }

  public redirectToPremium(): void {
    this.router.navigate(['app', 'premium']);
    this.dialogRef.close();
  }

  public close(): void {

  }
}
