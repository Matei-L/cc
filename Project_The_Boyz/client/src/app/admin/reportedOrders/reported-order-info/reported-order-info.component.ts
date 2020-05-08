import {Component, OnInit} from '@angular/core';
import {User} from '../../../utils/models/User';
import {AuthService} from '../../../utils/auth/auth.service';

@Component({
  selector: 'app-reported-order-info',
  templateUrl: './reported-order-info.component.html',
  styleUrls: ['./reported-order-info.component.scss']
})
export class ReportedOrderInfoComponent implements OnInit {

  currentUser: User;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
  }

}
