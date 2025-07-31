import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit, Optional, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePostDetail } from '../../updates.model';
import { UpdatesResources } from '../../updates.resources';
import { firstValueFrom } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SvgIconComponent} from "angular-svg-icon";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {SafeHtmlPipe} from "../../../../shared/components/premium/pipes/safe-html.pipe";

@Component({
  selector: 'app-updates-post-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent, SvgIconComponent, TranslateModule, SafeHtmlPipe],
  templateUrl: './updates-post-detail.component.html',
  styleUrls: ['./updates-post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesPostDetailComponent implements OnInit {
  public post: UpdatePostDetail;

  @Input()
  public dialog: boolean = false;

  @Input()
  public dialogPost: UpdatePostDetail;

  @Output()
  public close: EventEmitter<void> = new EventEmitter();

  constructor(
    private readonly resources: UpdatesResources,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.getPost();
  }

  public get title(): string {
    return (
      this.post?.[`title_${this.translateService.currentLang}`] ??
      this.post.title_ru
    );
  }

  public get content(): string {
    return (
      this.post?.[`content_${this.translateService.currentLang}`] ??
      this.post.content_ru
    );
  }

  public get description(): string {
    return (
      this.post?.[`description_${this.translateService.currentLang}`] ??
      this.post.description_ru
    );
  }

  public redirectToPremium(): void {
    if (this.dialog) {
      this.close.emit();
    }

    this.router.navigate(['app', 'premium']);
  }

  private async getPost(): Promise<void> {
    if (this.dialog) {
      this.post = this.dialogPost;
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      this.post = await firstValueFrom(this.resources.getPostDetail(id));
    }
    this.cdr.detectChanges();
  }
}
