import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordRestoreStages} from "../../../shared/models/PasswordRestoreStages";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../data-access/auth.service";
import {Observable, Subscription} from "rxjs";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerComponent} from "../../../shared/components/progress-spinner/progress-spinner.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'hive-restore',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ProgressSpinnerComponent, TranslateModule],
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss', '../auth-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreComponent {
  @Output()
  public redirectToSignIn: EventEmitter<void> = new EventEmitter<void>();

  public emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(200),
      Validators.required
    ])
  });

  public codeForm: FormGroup = new FormGroup({
    code: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(200),
      Validators.required
    ])
  });

  public passwordForm: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required
    ]),
  });

  public loading$: Observable<boolean> = this.authService.getAuthLoading();
  public message$: Observable<string> = this.authService.getAuthErrorMessage();
  public restorePasswordStage$: Observable<PasswordRestoreStages> = this.authService.getRestorePasswordStage();
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.restorePasswordStage$.subscribe(stage => {
        if (stage === 'finish') {
          this.redirectToSignIn.emit();
        }
      })
    )
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.authService.dispatchRestoreReset();
  }

  public submitEmail(): void {
    const {email} = this.emailForm.value;
    this.authService.dispatchRestoreEmailStage(email);
  }

  public submitCode(): void {
    const {code} = this.codeForm.value;
    const {email} = this.emailForm.value;
    this.authService.dispatchRestoreCodeStage(code, email);
  }

  public submitPassword(): void {
    const {password} = this.passwordForm.value;
    const {code} = this.codeForm.value;
    const {email} = this.emailForm.value;
    this.authService.dispatchRestorePasswordStage(password, code, email);
  }
}
