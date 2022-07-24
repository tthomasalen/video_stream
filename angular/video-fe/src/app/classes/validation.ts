import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { catchError, first, map, Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';




export default class Validation {


  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }



  static sanitisedName(controlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);

      let regex = /^[a-zA-Z \s]+$/;
      let res = regex.test(control?.value)
      console.log(res)
      if (res && control?.value != '') {
        return null;
      }

      if (!res && control?.value != '') {
        controls.get(controlName)?.setErrors({ namer: true });
        return { namer: true };
      } else {
        return null;
      }
    };
  }



  static matcher(controlName: string, checkControlName: string, http: HttpClient):  AsyncValidatorFn {
    return (controls: AbstractControl): Observable<any | null | {alreadyTaken: boolean}> => {
      return http.get(`${environment.baseUrl}email?email=${controls?.value}`).pipe(switchMap(a =>  {
          return of(null);
      }), catchError(() => {
        controls.get(checkControlName)?.setErrors({ alreadyTaken: true });
        return of({ alreadyTaken: true });
      }), first())

  

    };
  }

}
