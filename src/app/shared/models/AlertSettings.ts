export class AlertSettings {
  telegram_alerts_enabled: boolean;
  telegram_user_id: string;

  alert_sound_enabled: boolean;
  alert_sound_name: string;
}

export const defaultAlertSettings: AlertSettings = {
  telegram_alerts_enabled: false,
  telegram_user_id: undefined,
  alert_sound_enabled: true,
  alert_sound_name: 'default',
};
