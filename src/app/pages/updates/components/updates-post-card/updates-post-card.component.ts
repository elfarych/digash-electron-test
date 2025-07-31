import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePost } from '../../updates.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const isCreatedLessThan10DaysAgo = (isoDateString: string): boolean => {
  const createdDate = new Date(isoDateString);
  const now = new Date();

  const createdTime = createdDate.getTime();
  const nowTime = now.getTime();

  const diffInMs = nowTime - createdTime;
  const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;

  return diffInMs < tenDaysInMs;
};

@Component({
  selector: 'app-updates-post-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './updates-post-card.component.html',
  styleUrls: ['./updates-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesPostCardComponent implements OnChanges {
  @Input()
  public post: UpdatePost;

  public newPost: boolean = false;

  constructor(
    private translateService: TranslateService,
    private router: Router,
  ) {}

  public ngOnChanges({ post }: SimpleChanges) {
    if (post) {
      this.newPost = isCreatedLessThan10DaysAgo(this.post.created_at);
    }
  }

  public navigateToPostDetail(): void {
    this.router.navigate(['app', 'updates', this.post.id]);
  }

  public getPostUrl(): string {
    return location.origin + `/#/app/updates/${this.post.id}`;
  }

  public get title(): string {
    return (
      this.post?.[`title_${this.translateService.currentLang}`] ??
      this.post.title_ru
    );
  }

  public get description(): string {
    return (
      this.post?.[`description_${this.translateService.currentLang}`] ??
      this.post.description_ru
    );
  }
}
