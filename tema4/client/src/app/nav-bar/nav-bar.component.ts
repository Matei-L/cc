import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {environment} from '../../environments/environment';
import {UtilFunctions} from '../utils/util-functions.ts';
import {AuthService} from '../utils/auth/auth.service';
import {User} from '../utils/auth/User';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentUser: User;
  profilePhotoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();
  profileNickname = '';

  constructor(public router: Router, public dialog: MatDialog, private authService: AuthService) {
  }

  async ngOnInit() {
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

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  async goTo(location) {
    await this.router.navigate([location]);
    if (!location.endsWith('/profile')) {
      window.location.reload();
    }
  }

  checkLoggedIn() {
    return this.authService.getIsAuthenticated();
  }
}
