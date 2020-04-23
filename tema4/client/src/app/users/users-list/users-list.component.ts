import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersListService} from './users-list.service';
import {User} from '../../utils/models/User';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Game} from '../../utils/models/Game';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: Array<User>;

  constructor(private cdRef: ChangeDetectorRef, private router: Router,
              private usersListService: UsersListService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
    const loadingBar = this.snackBar.open('Fetching users...', 'Close');
    this.usersListService.getUsers().subscribe(
      users => {
        this.users = users;
        console.log(this.users);
        loadingBar.dismiss();
      });
  }

  async goTo(location) {
    await this.router.navigate([location]);
  }
}
