import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  public get isMobile(): boolean {
    return window.innerWidth <= 992;
  }

  public get isElectron(): boolean {
    return !!window.electronAPI;
  }
}
