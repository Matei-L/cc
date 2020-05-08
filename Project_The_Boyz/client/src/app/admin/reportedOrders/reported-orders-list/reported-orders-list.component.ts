import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../utils/auth/auth.service';
import {User} from "../../../utils/models/User";

@Component({
  selector: 'app-reported-orders-list',
  templateUrl: './reported-orders-list.component.html',
  styleUrls: ['./reported-orders-list.component.scss']
})
export class ReportedOrdersListComponent implements OnInit {


  currentUser: User;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
  }

}
