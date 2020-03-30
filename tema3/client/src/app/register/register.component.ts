import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {RegisterService} from './register.service';
import {User} from '../utils/auth/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private dialogRef: MatDialogRef<RegisterComponent>,
              private fireAuth: AngularFireAuth,
              private registerService: RegisterService) {
  }

  email: string;
  password: string;
  repeatedPassword: string;

  ngOnInit(): void {
  }

  register() {
    const dialogRef = this.dialogRef;
    if (this.password === this.repeatedPassword) {
      this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
        alert(error.message);
      }).then((result) => {
        if (result) {
          this.fireAuth.authState.subscribe(fireAuthUser => {
            const user = {} as User;
            user.nickname = '';
            user.description = '';
            user.audioUrl = '';
            user.photoUrl = '';
            user.email = fireAuthUser.email;
            user.uid = fireAuthUser.uid;
            this.registerService.postUser(user).subscribe(res => {
              alert('Account Created.');
              window.location.reload();
            });
          });
        }
      });
    } else {
      alert('Passwords don\'t match');
    }
  }
}
