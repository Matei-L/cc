import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Directive({
  selector: '[appForbiddenPhotoUrl]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input('appForbiddenPhotoUrl') forbiddenPhotoUrl: string;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.forbiddenPhotoUrl ? this.forbiddenPhotoUrlValidator(environment.randomAvatars)(control)
      : null;
  }

  forbiddenPhotoUrlValidator(photoUrl: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = photoUrl.startsWith(environment.randomAvatars);
      console.log(photoUrl);
      console.log(environment.randomAvatars);
      return forbidden ? {forbiddenPhotoUrl: {value: control.value}} : null;
    };
  }
}
