import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
/**
 * Astea trebuie puse cam in toate paginile care au nevoie de login
 */
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {environment} from '../../environments/environment';
import {UtilFunctions} from '../utils/util-functions.ts';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  profilePhotoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();

  constructor(public router: Router, public dialog: MatDialog, private auth: AngularFireAuth, private cdRef: ChangeDetectorRef) {
    this.loggedIn = false;
  }

  loggedIn: boolean;

  async ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
        this.cdRef.detectChanges();
      } else {
        this.loggedIn = false;
        this.cdRef.detectChanges();
      }
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  openRegisterDialog() {
    this.dialog.open(RegisterComponent);
  }

  getEmail() {
    return firebase.auth().currentUser.email;
  }

  async logOut() {
    await firebase.auth().signOut();
    window.location.reload();
  }
}
