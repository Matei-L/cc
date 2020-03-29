import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getIsAuthenticated().pipe(map(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/']);
      }
      return isLoggedIn;
    }));
  }
}
