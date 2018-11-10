import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInterface } from './user-interface';
import { Observable } from 'rxjs/index';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

  registrationForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.pattern(this.passwordPattern)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  httpOptions = {
    headers: new HttpHeaders({
      'mode': 'cors',
      'Access-Control-Allow-Origin': '*',
      'Content-Type':  'application/json'
    })
  };

  errorHandlers = {
    required: () => 'This field is required.',
    email: () => 'This field should contain your real email',
    minlength: error => `This field should contain more than ${error.requiredLength} characters.`,
    maxlength: error => `Should contain less than ${error.requiredLength} characters.`,
    pattern: () => 'Password should contain at least 1 big letter, 1 small letter, 1 spec symbol and 1 digit.'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getErrorMessage(control) {
    console.log(control.errors);
    const errorName = Object.keys(control.errors)[0];

    return this.errorHandlers[errorName](control.errors[errorName]);
  }

  doRegistartion(): Observable<UserInterface> {
    return this.http.post<UserInterface>(`//localhost:8080/api/users`, {
        email: this.registrationForm.controls['email'].value,
        password: this.registrationForm.controls['password'].value
      }, this.httpOptions);
  }

  register() {
    this.doRegistartion().subscribe(response => {
      console.log('Will send mail after registration!');
    });
  }
}
