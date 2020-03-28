import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private dialogRef: MatDialogRef<LoginComponent>,
              private fireAuth: AngularFireAuth) {
  }

  email: string;
  password: string;

  ngOnInit(): void {
  }

  login(): void {
    this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).catch((error) => {
      alert(error.message);
    }).then((result) => {
      if (result) {
        const user = firebase.auth().currentUser;
        if (user) {
          user.getIdToken(true).then((idToken) => {
            console.log(idToken);
          });
        }
        this.dialogRef.close({data: true});
      }
    });
  }
}
