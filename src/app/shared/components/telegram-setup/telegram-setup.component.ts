import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelegramSetupService } from './telegram-setup.service';
import { FormsModule } from '@angular/forms';
import { filter, Observable, Subscription } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { selectUserData } from 'src/app/auth/data-access/auth.selectors';
import { UserData } from '../../models/Auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-telegram-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ToastModule,
    TranslateModule,
  ],
  templateUrl: './telegram-setup.component.html',
  styleUrls: ['./telegram-setup.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelegramSetupComponent implements AfterViewInit, OnDestroy {
  public telegramChatId: string;
  public telegramChatId$: Observable<string> = this.service.telegramChatId$;
  public errorMessage$: Observable<string> = this.service.errorMessage$;
  public user$: Observable<UserData> = this.store.select(selectUserData);
  private subscriptions: Subscription = new Subscription();

  constructor(
    private service: TelegramSetupService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private store: Store,
  ) {}

  public ngAfterViewInit(): void {
    this.telegramChatId$.pipe(filter(Boolean)).subscribe((chatId: string) => {
      this.telegramChatId = chatId;
      this.cdr.detectChanges();
    });

    this.subscriptions.add(
      this.errorMessage$.pipe(filter(Boolean)).subscribe((errorMessage) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: this.translateService.instant(
        //     'ERROR_CODES.NOTIFICATION_SETTINGS_ERROR',
        //   ),
        //   detail: errorMessage,
        //   life: 100_000,
        // });
        console.log(errorMessage);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public telegramChatIdChange(): void {
    this.service.updateTelegramChatId(this.telegramChatId);
  }

  public shouldHide(username: string): boolean {
    return ['digahka', 'admin', 'eldar farych'].includes(
      username.toLowerCase(),
    );
  }
}
