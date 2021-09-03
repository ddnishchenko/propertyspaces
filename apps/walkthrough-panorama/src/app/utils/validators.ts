import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const VALIDATORS_OF_EMAIL = [Validators.email, Validators.pattern(EMAIL_REGEX)];
export const REQUIRED_EMAIL_VALIDATOR = [...VALIDATORS_OF_EMAIL, Validators.required, Validators.maxLength(60)];


/**
 * @example
 * ```typescript
 * const form = new FormGroup({
 *  password: new FormControl(''),
 *  password_confirm: new FormControl('', [equalityValidator('password')])
 * });
 * ```
 * @param {string} fieldName - name of field what must be equal current control value
 * @returns {(control: AbstractControl) => (null | {invalid: boolean})}
 */
export function equalityValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.parent || !control) return;
    const source = control;
    const copyOfSource = control.parent.get(fieldName);

    if (!source || !copyOfSource) return null;
    if (source.value !== copyOfSource.value) {
      return { [`${fieldName}NotEqual`]: true };
    }
  };
}

// Min 8 and max 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character (`~!@#$%^&*()_\-+={}\[\]|"':;,.<>\/№?)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\w]).{8,16}$/;
export const VALIDATORS_OF_PASSWORD = [
  Validators.pattern(PASSWORD_REGEX),
  Validators.minLength(8),
  Validators.maxLength(16),
  Validators.required
];
