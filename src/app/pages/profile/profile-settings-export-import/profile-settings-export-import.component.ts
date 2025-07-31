import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { ReferralCoupon } from '../referrals/utils/models/referrals.model';
import { KeyValuePipe, NgForOf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeIcons } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {ApiGatewayService} from "../../../core/http/api-gateway.service";

@Component({
  selector: 'app-profile-settings-export-import',
  templateUrl: './profile-settings-export-import.component.html',
  styleUrls: ['./profile-settings-export-import.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    FileUploadModule,
    PanelModule,
    TabViewModule,
    CheckboxModule,
    KeyValuePipe,
    NgForOf,
    ToastModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class ProfileSettingsExportImportComponent {
  protected checkboxData = new Map([
    ['workspaces', 'profile.importExportSettings.workspaces'],
    ['depth_map', 'profile.importExportSettings.depthMap'],
    ['coins_navigation', 'profile.importExportSettings.coins_navigation'],
    ['user_preferences', 'profile.importExportSettings.user_preferences'],
    ['alerts', 'profile.importExportSettings.alerts'],
    ['psychology', 'profile.importExportSettings.psychology'],
  ]);
  protected checkboxExportData = new Map([
    ['export-workspaces', 'profile.importExportSettings.workspaces'],
    ['export-depth-map', 'profile.importExportSettings.depthMap'],
    [
      'export-coins_navigation',
      'profile.importExportSettings.coins_navigation',
    ],
    [
      'export-user_preferences',
      'profile.importExportSettings.user_preferences',
    ],
    ['export-alerts', 'profile.importExportSettings.alerts'],
    ['export-psychology', 'profile.importExportSettings.psychology'],
  ]);

  public selectedCheckboxes: string[] = [];
  public selectedExportCheckboxes: string[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private translateService: TranslateService,
    private apiGatewayService: ApiGatewayService
  ) {}

  public onCheckboxChange(value: string): void {
    if (this.selectedCheckboxes.includes(value)) {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(
        (item) => item !== value,
      );
    } else {
      this.selectedCheckboxes.push(value);
    }
  }

  public onExportCheckboxChange(value: string): void {
    if (this.selectedExportCheckboxes.includes(value)) {
      this.selectedExportCheckboxes = this.selectedExportCheckboxes.filter(
        (item) => item !== value,
      );
    } else {
      this.selectedExportCheckboxes.push(value);
    }
  }

  public async onFileSelected(event: any): Promise<void> {
    const file = event.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    if (file.type !== 'application/json') {
      console.error('Incorrect file format. Please upload a JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const configurationJson = JSON.parse(reader.result as string);
        const filteredConfiguration = {};
        for (const selectedCheckbox of this.selectedCheckboxes) {
          if (selectedCheckbox in configurationJson) {
            filteredConfiguration[selectedCheckbox] =
              configurationJson[selectedCheckbox];
          }
        }

        await firstValueFrom(
          this.http.post<ReferralCoupon>(
            `${this.apiGatewayService.getBaseUrl()}/user/profile/import/`,
            filteredConfiguration,
          ),
        );

        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('STATUS_MESSAGES.SUCCESS'),
          detail: this.translateService.instant(
            'STATUS_MESSAGES.IMPORT_SUCCESSFUL',
          ),
        });

        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: this.translateService.instant('ERROR_CODES.ERROR'),
        //   detail: this.translateService.instant('ERROR_CODES.IMPORT_FAILED'),
        // });
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  }

  public async exportJson(): Promise<void> {
    try {
      const exportConfiguration = await firstValueFrom(
        this.http.get<object>(`${this.apiGatewayService.getBaseUrl()}/user/profile/export/`, {
          params: { settings_list: this.selectedExportCheckboxes.join(',') },
        }),
      );

      const blob = new Blob([JSON.stringify(exportConfiguration, null, 2)], {
        type: 'application/json',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'configuration.json';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте JSON:', error);
    }
  }

  protected readonly PrimeIcons = PrimeIcons;
}
