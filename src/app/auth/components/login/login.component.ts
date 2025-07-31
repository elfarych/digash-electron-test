import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { filter, Observable, Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'hive-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    GoogleSigninButtonModule,
    InputTextModule,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output()
  public redirectToSignup: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public redirectToRestore: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(30),
      Validators.required,
    ]),
    password: new FormControl('', [Validators.minLength(0), Validators.required]),
    keep_sign_in: new FormControl(true),
  });

  public loading$: Observable<boolean> = this.authService.getAuthLoading();
  public message$: Observable<string> = this.authService.getAuthErrorMessage();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.socialAuthService.authState
        .pipe(filter((user: SocialUser) => user.provider === 'GOOGLE'))
        .subscribe((user: SocialUser) => this.googleAuth(user)),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submit(): void {
    const { username, password } = this.form.value;
    this.authService.dispatchLogin(username, password);
  }

  private googleAuth(user: SocialUser): void {
    this.authService.dispatchGoogleAuth(user);
  }
}
