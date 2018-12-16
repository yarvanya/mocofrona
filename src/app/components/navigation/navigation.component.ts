import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  isLogged: boolean;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.isUserLogged.subscribe(auth_data => {
      this.isLogged = auth_data.isLoggedIn;
    });
  }

  logIn() {
    this.router.navigate(['login']);
  }

  logOff() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
