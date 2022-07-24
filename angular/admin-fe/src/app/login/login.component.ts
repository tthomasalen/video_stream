import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OverallService } from '../service/overall.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private overall: OverallService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.overall.startLogin(this.form.value)

    console.log(JSON.stringify(this.form.value, null, 2));

}

}