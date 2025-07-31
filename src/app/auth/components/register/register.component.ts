import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'hive-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    InputTextModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../auth-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output()
  public redirectToSignIn: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(80),
      Validators.required,
    ]),
    username: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(30),
      Validators.required,
    ]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  });

  public hide = true;
  public emailNumberError: boolean = false;
  public loading$: Observable<boolean> = this.authService.getAuthLoading();
  public message$: Observable<string> = this.authService.getAuthErrorMessage();

  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form.valueChanges.subscribe(({ email }) => {
        this.emailNumberError = /^\d/.test(email);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submit(): void {
    const { username, password, email } = this.form.value;
    this.authService.dispatchRegister(username, password, email);
  }
}
