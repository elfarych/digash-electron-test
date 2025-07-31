import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from '../../../../shared/components/menu/menu.component';
import {ReadableSoundName} from '../../../../shared/pipes/readableSoundName';
import {MenuTriggerDirective} from '../../../../shared/components/menu/menu-trigger.directive';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownOptions} from '../../../../shared/types/base.types';
import {AlertSoundType} from '../../../../shared/models/Alert';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sound-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReadableSoundName,
    MenuTriggerDirective,
    MenuComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './alerts-sound-selector.component.html',
  styleUrls: ['./alerts-sound-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsSoundSelectorComponent {
  @Input()
  public selectedSound: AlertSoundType;

  @Output()
  public soundChanged: EventEmitter<AlertSoundType> =
    new EventEmitter<AlertSoundType>();

    public readonly sounds: DropdownOptions<AlertSoundType> = [
      {label: this.translateService.instant('sound.default'), value: 'default'},
      {label: this.translateService.instant('sound.sound_7'), value: 'sound_7'},
      {label: this.translateService.instant('sound.sms'), value: 'sms'},
      {label: this.translateService.instant('sound.sound_5'), value: 'sound_5'},
      {label: this.translateService.instant('sound.sound_2'), value: 'sound_2'},
      {label: this.translateService.instant('sound.sound_3'), value: 'sound_3'},
      {label: this.translateService.instant('sound.sound_4'), value: 'sound_4'},
      {label: this.translateService.instant('sound.sound_6'), value: 'sound_6'},
      {label: this.translateService.instant('sound.sound_7'), value: 'sound_7'},
      {label: this.translateService.instant('sound.sound_8'), value: 'sound_8'},
      {label: this.translateService.instant('sound.sound_9'), value: 'sound_9'},
      {label: this.translateService.instant('sound.sound_10'), value: 'sound_10'},
      {label: this.translateService.instant('sound.sound_11'), value: 'sound_11'}
    ];


  private audio: HTMLAudioElement;

  constructor(private translateService: TranslateService) {}

  public changeSound(event: DropdownChangeEvent): void {
    document.querySelectorAll('audio').forEach(el => el.pause());

    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio = new Audio();
    this.audio.src = `../../../assets/sounds/${event.value}.mp3`;
    this.audio.load();
    this.audio.play();

    this.soundChanged.emit(event.value);
  }
}
