import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, mergeMap} from 'rxjs/operators';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router, private fireAuth: AngularFireAuth) {
  }

  async logOut() {
    await this.fireAuth.auth.signOut();
    window.location.reload();
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.fireAuth.authState.pipe(map((user) => {
      return !!user;
    }));
  }

  getCurrentUser(): Observable<any> {
    return this.fireAuth.authState;
  }

  getIdToken(): Observable<string | null> {
    return this.fireAuth.idToken;
  }
}
