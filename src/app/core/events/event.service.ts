import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

export type CustomAppEventName =
  | 'chart:drawing-tools-updated'
  | 'chart:range-updated'
  | 'chart:signal-levels-updated';

export interface AppCustomEvent {
  name: CustomAppEventName;
  data: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AppEventService {
  private eventSubject = new Subject<{
    name: CustomAppEventName;
    data: unknown;
  }>();
  public event$ = this.eventSubject.asObservable();

  public emitEvent(event: AppCustomEvent) {
    this.eventSubject.next({ name: event.name, data: event.data });
  }
}
