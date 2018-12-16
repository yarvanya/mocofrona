import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  isLogged: boolean;

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isUserLogged.subscribe(auth_data => {
      this.isLogged = auth_data.isLoggedIn;
    });
  }
}
