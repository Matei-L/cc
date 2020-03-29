import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private dialogRef: MatDialogRef<RegisterComponent>,
              private fireAuth: AngularFireAuth) {
  }

  email: string;
  password: string;
  repeatedPassword: string;

  ngOnInit(): void {
  }

  register() {
    if (this.password === this.repeatedPassword) {
      this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
        alert(error.message);
      }).then((result) => {
        if (result) {
          alert('Account created');
        }
      });
    } else {
      alert('Passwords don\'t match');
    }
  }
}
