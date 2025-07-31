import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Psychology } from '../../../../shared/models/Psychology';
import { PsychologyService } from '../../data-access/psychology.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import {ButtonModule} from "primeng/button";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-psychology-popup',
  standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatRippleModule,
        DividerModule,
        ButtonModule,
        TranslateModule
    ],
  templateUrl: './psychology-popup.component.html',
  styleUrls: ['./psychology-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsychologyPopupComponent {
  constructor(
    public ref: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public data: { data: Psychology },
    private service: PsychologyService,
  ) {}

  public close(): void {
    this.service.psychologyWatched(this.data?.data?.id);
    this.ref.close();
  }
}
