import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {Game} from '../../models/Game';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: Array<User>;

  constructor(private cdRef: ChangeDetectorRef, private router: Router) {
    const games = [];
    games.push('Game #1', 'Game #2', 'Game #3');
    this.users = new Array<User>();
    this.users.push(new User('mariusblaj61@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
    this.users.push(new User('lipanmatei@gmail.com', ['Overwatch', 'Metin2'], 'asd'));
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  async goTo(location) {
    await this.router.navigate([location]);
    window.location.reload();
  }
}
