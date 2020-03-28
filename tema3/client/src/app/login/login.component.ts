import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private dialogRef: MatDialogRef<LoginComponent>) {
  }

  username: string;
  password: string;

  ngOnInit(): void {
  }

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.dialogRef.close({data: true});
    } else {
      this.dialogRef.close({data: false});
    }
  }

  close() {
    alert('closed');
  }

}
