import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Matches regular expression.
 * @param {RegExp} RegExp - Regular expression.
 * @returns {ValidatorFn}
 */
export function regExpValidator(RegExp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = RegExp.test(control.value);
    return forbidden ? { forbiddenString: { value: control.value } } : null;
  };
}
