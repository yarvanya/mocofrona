import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../interfaces/user-interface';
import { constants } from '../../helper/constants';
import { Observable } from 'rxjs/index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  newUser: object;
  successfullyRegistered = false;

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
  }, this.validateConfirmPassword);

  errorHandlers = {
    required: () => 'This field is required.',
    email: () => 'This field should contain your real email',
    minlength: error => `This field should contain more than ${error.requiredLength} characters.`,
    maxlength: error => `Should contain less than ${error.requiredLength} characters.`,
    pattern: () => 'Password should contain at least 1 big letter, 1 small letter, 1 spec symbol and 1 digit.'
  };

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  validateConfirmPassword(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : {mismatch: true};
  }

  getErrorMessage(control) {
    const errorName = Object.keys(control.errors)[0];

    return this.errorHandlers[errorName](control.errors[errorName]);
  }

  doRegistartion(): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${constants.backEndUrl}${constants.routes.registration}`, {
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value
    });
  }

  register() {
    this.doRegistartion().subscribe(response => {
      this.newUser = response.user;
      this.successfullyRegistered = true;

      this.registrationForm.setValue({
        email: '',
        password: '',
        confirmPassword: ''
      });
      this.registrationForm.markAsUntouched();
      this.showToastr(response);
    }, catchedError => {
      this.showToastr(catchedError.error);
    });
  }

  showToastr(data) {
    this.toastr[`${data.status}`](`${data.message}`);
  }
}
