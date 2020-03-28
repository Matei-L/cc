import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
        this.router.navigate(['']);
      }
    });
    return this.isAuthenticated;
  }
}
