import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Preset } from '../../../../models/Preset';

@Component({
  selector: 'app-preset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetComponent {
  @Input()
  public preset: Preset;

  @Output()
  public selectPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public editPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public deletePreset: EventEmitter<number> = new EventEmitter<number>();

  public onSelect(): void {
    this.selectPreset.emit(this.preset);
  }

  public onDelete(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.deletePreset.emit(this.preset.id);
  }

  public onEdit(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editPreset.emit(this.preset);
  }
}
