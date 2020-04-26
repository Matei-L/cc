import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from './User';
import {BroadcastService, MsalService} from '@azure/msal-angular';
import {CryptoUtils, Logger} from 'msal';
import {apiConfig, isIE, loginRequest, tokenRequest} from './config';

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
      this.getUser(uid).subscribe((user: User) => {
        if (user.uid === undefined) {
          const manualUser = {} as User;
          manualUser.uid = uid;
          manualUser.nickname = this.msalService.getAccount().name;
          manualUser.email = this.msalService.getAccount().idToken.emails[0];
          this.postUser(manualUser).subscribe(() => {
            this.refreshUserData();
          });
        }
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
      this.getUser(uid).subscribe(user => {
        user.uid = uid;
        if (user.photoUrl) {
          user.photoUrl = user.photoUrl.replace('@', '%40');
        }
        if (user.audioUrl) {
          user.audioUrl = user.audioUrl.replace('@', '%40');
        }
        this.currentUser.next(user);
      });
    }
  }

  private getUser(uid: string): Observable<User> {
    return this.http.get<User>(this.api + `/users/${uid}`);
  }

  private postUser(user: User) {
    return this.http.post(this.api + `/users`, user);
  }
}
