import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication.service';
import { StateService } from '../../state/state.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  submitted: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
     private auth: AuthenticationService, private state: StateService) {

      state.header.nativeElement.style.display = 'none'


    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ]
      }
    );

   }

   ngOnDestroy(): void {
    this.state.header.nativeElement.style.display = ''
   }


   get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


   onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.auth.startLogin(this.form.value)

    // console.log(JSON.stringify(this.form.value, null, 2));


  }

}
