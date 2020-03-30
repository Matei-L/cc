import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
/**
 * Astea trebuie puse cam in toate paginile care au nevoie de login
 */
import {environment} from '../../environments/environment';
import {UtilFunctions} from '../utils/util-functions.ts';
import {AuthService} from '../utils/auth/auth.service';
import {loggedIn} from '@angular/fire/auth-guard';
import {User} from '../utils/auth/User';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentUser: User;
  loggedIn = false;
  profilePhotoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();
  profileNickname = '';

  constructor(public router: Router, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
  }

  async ngOnInit() {
    this.authService.getIsAuthenticated().subscribe((isAuthenticated) => {
      this.loggedIn = isAuthenticated;
    });
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (user) {
        if (user.photoUrl && user.photoUrl.length > 0) {
          this.profilePhotoUrl = user.photoUrl;
        }
        if (user.nickname.length > 0) {
          this.profileNickname = user.nickname;
        } else {
          this.profileNickname = user.email;
        }
      }
    });
  }


  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  openRegisterDialog() {
    this.dialog.open(RegisterComponent);
  }

  async logOut() {
    await this.authService.logOut();
  }

  async goTo(location) {
    await this.router.navigate([location]);
    if (!location.endsWith('/profile')) {
      window.location.reload();
    }
  }
}
