import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  games: Array<string>;

  constructor() {
    this.games = [];
    this.games.push('Game #1', 'Game #2', 'Game #3');
  }

  ngOnInit(): void {
  }


  getUsername() {
    return 'xXx.PickleRick.xXx';
  }
}
