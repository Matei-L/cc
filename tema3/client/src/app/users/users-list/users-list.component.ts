import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  games: Array<string>;

  constructor( private cdRef: ChangeDetectorRef) {
    this.games = [];
    this.games.push('Game #1', 'Game #2', 'Game #3');
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }


  getUsername() {
    return 'xXx.PickleRick.xXx';
  }
}
