import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noWhitespaceValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasWhitespace = control.value.includes(' ');
    return hasWhitespace ? { whitespace: true } : null;
  };
};
