import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Preset } from '../../models/Preset';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PresetComponent } from './components/preset/preset.component';

@Component({
  selector: 'app-presets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    PresetComponent,
  ],
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetsComponent implements OnChanges {
  @Input()
  public presets: Preset[] = [];

  @Input()
  public selectedPreset: Preset;

  @Output()
  public selectPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public editPreset: EventEmitter<Preset> = new EventEmitter<Preset>();

  @Output()
  public createPreset: EventEmitter<Partial<Preset>> = new EventEmitter<
    Partial<Preset>
  >();

  @Output()
  public deletePreset: EventEmitter<number> = new EventEmitter<number>();

  public showPresets: boolean = false;
  public showCreatePresetForm: boolean = false;

  public form: FormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });

  public presetToEdit: Preset | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  public ngOnChanges({ selectedPreset }: SimpleChanges) {
    if (selectedPreset && !selectedPreset.isFirstChange()) {
      this.showPresets = false;
      this.cdr.detectChanges();
    }
  }

  public toggleShowPresets(): void {
    this.showPresets = !this.showPresets;
    this.cdr.detectChanges();
  }

  public toggleShowCreatePresetForm(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.showCreatePresetForm = !this.showCreatePresetForm;
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      if (this.presetToEdit) {
        this.editPreset.emit({
          ...this.presetToEdit,
          name: String(this.form.get('name').value),
        });
        this.presetToEdit = null;
      } else {
        this.createPreset.emit(this.form.getRawValue());
        this.toggleShowPresets();
      }

      this.form.get('name').setValue('');
      this.showCreatePresetForm = !this.showCreatePresetForm;

      this.cdr.detectChanges();
    }
  }

  public handleTyping(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  public onEditPreset(preset: Preset): void {
    this.presetToEdit = preset;
    this.showCreatePresetForm = true;
    this.form.get('name').setValue(preset.name);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPresets = false;
      this.showCreatePresetForm = false;
      this.form.get('name').setValue('');
      this.cdr.detectChanges();
    }
  }
}
