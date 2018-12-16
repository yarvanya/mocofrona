import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { constants } from '../helper/constants';
import { LoggingUser } from '../interfaces/logging-user.interface';

@Injectable()
export class AuthService {
  authData = JSON.parse(localStorage.getItem('loggedUser'));
  isUserLogged = new BehaviorSubject({
    isLoggedIn: this.isLoggedIn,
    authData: this.authData || {}
  });
  falsyValue: boolean = false;
  truelyValue: boolean = true;

  constructor(private http: HttpClient) {}

  public get isLoggedIn() {
    return (localStorage.getItem('loggedUser') !== null);
  }

  eventChange(event_data) {
    if (event_data && event_data.token && event_data.userId) {
      this.isUserLogged.next({
        isLoggedIn: this.truelyValue,
        authData: event_data
      });
    } else {
      this.isUserLogged.next({
        isLoggedIn: this.falsyValue,
        authData: {}
      });
    }
  }

  login(authData: any): Observable<boolean> {
    return this.http.post<LoggingUser>(`${constants.backEndUrl}${constants.routes.login}`, authData)
      .pipe(
        map(result => {
          this.authData = {
            token: result.token,
            userId: result.userId,
            profileId: result.profileId
          }
          localStorage.setItem('loggedUser', JSON.stringify(this.authData));
          this.eventChange(JSON.parse(localStorage.getItem('loggedUser')));

          return this.truelyValue;
        })
      );
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.eventChange(JSON.parse(localStorage.getItem('loggedUser')));
  }
}
