import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Router} from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-free-premium-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, TranslateModule],
  templateUrl: './free-premium-dialog.component.html',
  styleUrls: ['./free-premium-dialog.component.scss']
})
export class FreePremiumDialogComponent {
  constructor(
    public dialogRef: DynamicDialogRef,
    private router: Router,
    @Inject(DynamicDialogConfig)
    public data: { data: { message: 'Активирован бесплатный премиум доступ' } },
  ) {
  }

  public navigate(path: string): void {
    this.dialogRef.close();
    this.router.navigate(['app', path])
  }
}
