import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  errorHandlers = {
    required: () => 'This field is required.'
  };

  isLogged: boolean;

  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.isUserLogged.subscribe(auth_data => {
      this.isLogged = auth_data.isLoggedIn;
    });
  }

  getErrorMessage(control) {
    const errorName = Object.keys(control.errors)[0];

    return this.errorHandlers[errorName](control.errors[errorName]);
  }

  submit() {
    this.auth.login(this.loginForm.value)
      .pipe(first())
      .subscribe(result => {
        this.isLogged = result;
        this.router.navigate(['home']);
      },
      catchedError => {
        this.showToastr(catchedError.error);
      });
  }

  showToastr(data) {
    this.toastr[`${data.status}`](`${data.message}`);
  }
}
