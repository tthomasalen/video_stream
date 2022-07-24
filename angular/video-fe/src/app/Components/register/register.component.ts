import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Validation from '../../classes/validation';
import { AuthenticationService } from '../../Services/authentication.service';
import { StateService } from '../../state/state.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {


  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    //username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private auth: AuthenticationService, private state: StateService) {

    state.header.nativeElement.style.display = 'none'

   }

   ngOnDestroy(): void {
    this.state.header.nativeElement.style.display = ''
   }


  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email], [Validation.matcher('email', 'alreadyTaken', this.http)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'confirmPassword'), Validation.sanitisedName('fullname')],
        // asyncValidators: [Validation.matcher('email', 'alreadyTaken', this.http)]
      }
    );

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
    this.auth.startRegisteration(this.form.value)

  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

}
