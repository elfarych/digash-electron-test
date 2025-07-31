import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { keymapSections } from './keymap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hotkey-map',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslateModule],
  templateUrl: './hotkey-map.component.html',
  styleUrls: ['./hotkey-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeyMapComponent {
  public visible = false;
  public readonly keymapSections = keymapSections;

  public showDialog(): void {
    this.visible = true;
  }
}
