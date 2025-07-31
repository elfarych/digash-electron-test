import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePostDetail } from '../../updates.model';
import { AuthService } from '../../../../auth/data-access/auth.service';
import { UserData } from '../../../../shared/models/Auth';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { UpdatesResources } from '../../updates.resources';
import { DialogModule } from 'primeng/dialog';
import { UpdatesPostDetailComponent } from '../updates-post-detail/updates-post-detail.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-unread-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    UpdatesPostDetailComponent,
    TranslateModule,
  ],
  templateUrl: './update-unread-post-dialog.component.html',
  styleUrls: ['./update-unread-post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUnreadPostDialogComponent implements OnInit, OnDestroy {
  public post: UpdatePostDetail;
  public showDialog: boolean = false;

  private subscriptions: Subscription = new Subscription();
  private user$: Observable<UserData> = this.authService.getUserData();

  constructor(
    private authService: AuthService,
    private readonly resources: UpdatesResources,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.user$.subscribe((user: UserData) => {
        if (user) {
          this.getPost();
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get title(): string {
    return (
      this.post?.[`title_${this.translateService.currentLang}`] ??
      this.post.title_ru
    );
  }

  public close(): void {
    this.showDialog = false;
  }

  private async getPost(): Promise<void> {
    this.post = await firstValueFrom(this.resources.getUnreadPost());
    if (this.post) {
      this.showDialog = true;
      this.cdr.detectChanges();
    }
  }
}
