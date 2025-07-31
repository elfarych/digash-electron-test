import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipsComponent } from '../../../shared/components/tooltips/tooltips.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileFriendsService } from './profile-friens.service';
import { UserReferralReward } from './utils/UserReferralReward';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserData } from '../../../shared/models/Auth';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthService } from '../../../auth/data-access/auth.service';

@Component({
  selector: 'app-profile-friends',
  standalone: true,
  imports: [
    CommonModule,
    TooltipsComponent,
    TranslateModule,
    ProgressSpinnerComponent,
  ],
  templateUrl: './profile-friends.component.html',
  styleUrls: ['./profile-friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFriendsComponent implements OnInit {
  @Input()
  public user: UserData;

  public referralLink: string = '';
  public loading: boolean = false;
  public unclaimedReferralRewardCount: number = 0;
  public referralsCount: number = 0;
  public claimedRewards: UserReferralReward[] = [];
  public unclaimedRewards: UserReferralReward[] = [];

  constructor(
    private readonly service: ProfileFriendsService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly cdr: ChangeDetectorRef,
    private authService: AuthService,
    private clipboard: Clipboard,
  ) {}

  public ngOnInit() {
    this.referralLink = location.origin + `/#/?ref_id=${this.user.user_id}`;
    this.getRewards();
    this.getReferralsCount();
  }

  public async copyRefLink(): Promise<void> {
    this.clipboard.copy(this.referralLink);
    this.messageService.add({
      severity: 'success',
      summary: this.referralLink,
      detail: this.translateService.instant('profile.refLinkCopied'),
    });
  }

  public async claimReward(): Promise<void> {
    if (!this.unclaimedRewards.length) {
      return void 0;
    }
    const reward = this.unclaimedRewards[0];
    this.loading = true;
    this.cdr.detectChanges();

    const result = await firstValueFrom(this.service.claimReward(reward.id));

    if (result?.claimed) {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('profile.friends.reward'),
        detail: this.translateService.instant(
          'profile.friends.yourRewardCredited',
        ),
      });

      this.authService.dispatchLoadUserData();
      this.getRewards();
      this.getReferralsCount();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('profile.friends.reward'),
        detail: this.translateService.instant(
          'profile.friends.rewardNotReceived',
        ),
      });
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  private async getReferralsCount(): Promise<void> {
    const referrals = await firstValueFrom(this.service.getUserReferrals());
    this.unclaimedReferralRewardCount =
      referrals?.filter((r) => !r.claimed)?.length ?? 0;
    this.referralsCount = referrals?.length ?? 0;
    this.cdr.detectChanges();
  }

  private async getRewards(): Promise<void> {
    const rewards = await firstValueFrom(this.service.getRewards());
    this.claimedRewards = rewards.filter((r) => r.claimed);
    this.unclaimedRewards = rewards.filter((r) => !r.claimed);
    this.cdr.detectChanges();
  }
}
