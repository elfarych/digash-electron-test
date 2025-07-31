import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePost } from './updates.model';
import { UpdatesResources } from './updates.resources';
import { firstValueFrom } from 'rxjs';
import { UpdatesPostCardComponent } from './components/updates-post-card/updates-post-card.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [
    CommonModule,
    UpdatesPostCardComponent,
    FooterComponent,
    TranslateModule,
  ],
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesComponent implements OnInit {
  public posts: UpdatePost[] = [];

  constructor(
    private readonly resources: UpdatesResources,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.loadPosts();
  }

  public get firstPost(): UpdatePost {
    return this.posts[0];
  }

  public get otherPosts(): UpdatePost[] {
    return this.posts?.slice(1) ?? [];
  }

  private async loadPosts(): Promise<void> {
    this.posts = await firstValueFrom(this.resources.getPosts());
    this.cdr.detectChanges();
  }
}
