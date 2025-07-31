import {Injectable} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {PremiumForbiddenDialogComponent} from "./premium-forbidden-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class PremiumForbiddenDialogService {
  public ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService,) {
  }

  public open(message = 'Данная функция открывается в премиум доступе'): void {
    this.ref = this.dialogService.open(PremiumForbiddenDialogComponent, {
      width: '720px',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      showHeader: false,
      closable: true,
      closeOnEscape: true,
      modal: true,
      dismissableMask: true,
      styleClass: 'promotion-dialog',
      data: {message}
    });
  }
}
