import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Matches regular expression.
 * @param {RegExp} regExp - Regular expression.
 * @returns {ValidatorFn}
 */
export function regExpValidator(regExp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = regExp.test(control.value);
    return forbidden ? { forbiddenString: { value: control.value } } : null;
  };
}
