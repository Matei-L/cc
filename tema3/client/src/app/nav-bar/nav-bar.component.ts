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


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentUser = null;
  loggedIn = false;
  profilePhotoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();

  constructor(public router: Router, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
  }

  async ngOnInit() {
    this.authService.getIsAuthenticated().subscribe((isAuthenticated) => {
      this.loggedIn = isAuthenticated;
    });
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }


  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  openRegisterDialog() {
    this.dialog.open(RegisterComponent);
  }

  getEmail() {
    if (this.currentUser) {
      return this.currentUser.email;
    }
    return '';
  }

  async logOut() {
    await this.authService.logOut();
  }
}
