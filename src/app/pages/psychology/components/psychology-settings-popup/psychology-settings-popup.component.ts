import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Psychology } from '../../../../shared/models/Psychology';
import { PsychologyService } from '../../data-access/psychology.service';
import { Observable } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-psychology-settings-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    EditorModule,
    CheckboxModule,
    DividerModule,
    TranslateModule,
  ],
  templateUrl: './psychology-settings-popup.component.html',
  styleUrls: ['./psychology-settings-popup.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsychologySettingsPopupComponent implements AfterViewInit {
  public errorMessage$: Observable<string> = this.service.getErrorMessage();

  @ViewChild('editor', { static: false })
  public editor;

  public form: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.minLength(0),
      Validators.maxLength(80),
      Validators.required,
    ]),
    content: new FormControl('', [
      Validators.minLength(0),
      Validators.required,
    ]),
    occurrenceHours: new FormControl(3, [
      Validators.min(0.2),
      Validators.max(72),
    ]),
    telegram: new FormControl(false),
  });

  public formTouched = false;

  constructor(
    @Inject(DynamicDialogConfig)
    public data: { data: { edit: boolean; data: Psychology } },
    public ref: DynamicDialogRef,
    private service: PsychologyService,
  ) {}

  public ngAfterViewInit(): void {
    if (this.data?.data?.edit) {
      this.patchValues();
    }
  }

  public occurrenceHoursChange(value: number): void {
    this.form.get('occurrenceHours').setValue(value);
  }

  public submit(): void {
    this.formTouched = true;

    if (!this.form.valid) {
      return void 0;
    }

    const data = this.form.getRawValue();

    if (this.data?.data?.edit) {
      this.service.initPsychologyEdit(data, this.data.data.data.id);
      return void 0;
    }

    this.service.initPsychologyCreation(data);
  }

  public close(): void {
    this.ref.close();
  }

  private patchValues(): void {
    const { data } = this.data?.data;

    setTimeout(() => {
      this.editor.quill.clipboard.dangerouslyPasteHTML(data.content);
    });

    this.form.patchValue({
      title: data.title,
      content: data.content,
      occurrenceHours: data.occurrenceHours,
      telegram: data.telegram,
    });
  }
}
