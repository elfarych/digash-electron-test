import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronNotificationService } from './shared/store/notifications/electron-notification.service';
import { PlatformService } from './core/platform/platform.service';

declare global {
  interface Window {
    require: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  constructor(
    private router: Router,
    private platformService: PlatformService,
    private electronNotificationService: ElectronNotificationService,
  ) {}

  public ngOnInit() {
    if (this.platformService.isElectron) {
      this.electronNotificationService.onNotificationClick((deepLink) => {
        if (deepLink) {
          this.router.navigateByUrl(deepLink);
        }
      });

      (window as any).electronAPI?.onDeepLink((url: string) => {
        console.log('[ELECTRON] deep-link received:', url);
        const path = url.replace(/^digash:\/\//, '');
        this.router.navigateByUrl('/' + path);
      });
    }
  }
}
