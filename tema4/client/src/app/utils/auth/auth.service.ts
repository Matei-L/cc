import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from './User';
import {BroadcastService, MsalService} from '@azure/msal-angular';
import {CryptoUtils, Logger} from 'msal';
import {loginRequest, tokenRequest} from './config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.baseUrl;
  private loggedIn = false;
  private currentUser = new BehaviorSubject<User>(null);
  private currentToken = new BehaviorSubject<string>(null);

  constructor(public router: Router, private http: HttpClient,
              private broadcastService: BroadcastService, private msalService: MsalService) {
    this.checkAccount();
    this.refreshUserData();
    // event listeners for authentication status
    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      console.log('login succeeded');
      this.checkAccount();
      this.refreshUserData();
    });

    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      console.log('login failed');
    });

    // redirect callback for redirect flow (IE)
    this.msalService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      this.currentToken.next(response.accessToken);
      this.checkAccount();
      this.refreshUserData();
    });

    this.msalService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  // other methods
  checkAccount() {
    this.loggedIn = !!this.msalService.getAccount();
    if (this.loggedIn) {
      const uid = this.msalService.getAccount().accountIdentifier;
      const subscription = this.currentToken.subscribe((token) => {
        this.getUser(uid, token).subscribe((user: User) => {
          if (user.uid === undefined) {
            const manualUser = {} as User;
            manualUser.uid = uid;
            manualUser.nickname = this.msalService.getAccount().name;
            manualUser.email = this.msalService.getAccount().idToken.emails[0];
            subscription.unsubscribe();
            this.currentToken.subscribe((newtoken) => {
              this.postUser(manualUser, newtoken).subscribe(() => {
                this.refreshUserData();
              });
            });
          }
        });
      });

      this.msalService.acquireTokenSilent(tokenRequest).catch((error) => {
        // Acquire token interactive failure
        console.log(error);
      }).then((tokenResponse) => {
        if (tokenResponse) {
          this.currentToken.next(tokenResponse.accessToken);
        }
      });
    } else {
      this.currentUser.next(null);
    }
  }

  login() {
    this.msalService.loginRedirect(loginRequest);
  }

  logout() {
    this.msalService.logout();
  }

  getIsAuthenticated(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  getIdToken(): Observable<string> {
    return this.currentToken.asObservable();
  }

  refreshUserData() {
    if (this.loggedIn) {
      const uid = this.msalService.getAccount().accountIdentifier;
      const subscription = this.currentToken.subscribe((token) => {
        this.getUser(uid, token).subscribe(user => {
          user.uid = uid;
          if (user.photoUrl) {
            user.photoUrl = user.photoUrl.replace('@', '%40');
          }
          if (user.audioUrl) {
            user.audioUrl = user.audioUrl.replace('@', '%40');
          }
          this.currentUser.next(user);
          subscription.unsubscribe();
        });
      });

    }
  }

  private getUser(uid: string, token): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<User>(this.api + '/users/' + uid, {headers});
  }

  private postUser(user: User, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.api + `/users`, user, {headers});
  }
}
