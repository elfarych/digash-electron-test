import {Injectable} from "@angular/core";
import {UnauthorizedPopupComponent} from "./unauthorized-popup.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AuthService} from "../../../auth/data-access/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedPopupService {
  public ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    private authService: AuthService
  ) {
  }

  public open(): void {
    this.ref = this.dialogService.open(UnauthorizedPopupComponent, {
      header: 'ТРОЛОЛО',
      width: '480px',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000
    });
  }
}
