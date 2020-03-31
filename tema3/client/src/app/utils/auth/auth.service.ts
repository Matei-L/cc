import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.baseUrl;

  currentUser = new BehaviorSubject<User>(null);

  constructor(public router: Router, private fireAuth: AngularFireAuth, private http: HttpClient) {
    this.fireAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.currentUser.next(null);
      } else {
        this.getUser(authUser.uid).subscribe(user => {
          user.uid = authUser.uid;
          user.photoUrl = user.photoUrl.replace('@', '%40');
          user.audioUrl = user.audioUrl.replace('@', '%40');
          this.currentUser.next(user);
        });
      }
    });
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

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  getIdToken(): Observable<string | null> {
    return this.fireAuth.idToken;
  }

  refreshUserData() {
    this.getUser(this.currentUser.value.uid).subscribe(user => {
      user.uid = this.currentUser.value.uid;
      this.currentUser.next(user);
    });
  }

  private getUser(uid: string): Observable<User> {
    return this.http.get<User>(this.api + `/users/${uid}`);
  }
}
