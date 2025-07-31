import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../../../shared/components/menu/menu.component';
import { ReadableSoundName } from '../../../../shared/pipes/readableSoundName';
import { MenuTriggerDirective } from '../../../../shared/components/menu/menu-trigger.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  AlertSettings,
  defaultAlertSettings,
} from '../../../../shared/models/AlertSettings';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { AlertsSoundSelectorComponent } from '../alerts-sound-selector/alerts-sound-selector.component';
import { AlertSoundType } from '../../../../shared/models/Alert';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from 'src/app/shared/models/Auth';

@Component({
  selector: 'app-alerts-settings-form',
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
    AlertsSoundSelectorComponent,
    DividerModule,
    TranslateModule
  ],
  templateUrl: './alerts-settings-form.component.html',
  styleUrls: ['./alerts-settings-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsSettingsFormComponent {
  @Input()
  public settings: AlertSettings;

  @Input()
  public userData: UserData;

  @ViewChild(MenuComponent)
  public menuComponent: MenuComponent;

  @Output()
  public settingsChanged: EventEmitter<AlertSettings> =
    new EventEmitter<AlertSettings>();

  public readonly alertsForm: FormGroup = new FormGroup({
    alert_sound_enabled: new FormControl(true),
    telegram_alerts_enabled: new FormControl(false),
    telegram_user_id: new FormControl<number>(undefined),
    alert_sound_name: new FormControl<string>('default'),
  });

  private readonly subscriptions: Subscription = new Subscription();

  public ngOnInit(): void {
    this.prepatchValues();

    this.subscriptions.add(
      this.alertsForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((values) => this.settingsChanged.emit(values)),
    );
  }

  public shouldHide(): boolean {
    return ['digahka', 'admin', 'eldar farych'].includes(this.userData?.username?.toLowerCase());
  }

  public changeSound(sound: AlertSoundType): void {
    this.alertsForm.controls['alert_sound_name'].setValue(sound);
  }

  private prepatchValues(): void {
    this.alertsForm.patchValue({
      alert_sound_enabled:
        this.settings.alert_sound_enabled ??
        defaultAlertSettings.alert_sound_enabled,
      telegram_alerts_enabled:
        this.settings.telegram_alerts_enabled ??
        defaultAlertSettings.telegram_alerts_enabled,
      telegram_user_id:
        this.settings.telegram_user_id ?? defaultAlertSettings.telegram_user_id,
      alert_sound_name:
        this.settings.alert_sound_name ?? defaultAlertSettings.alert_sound_name,
    });
  }
}
