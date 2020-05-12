import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../utils/auth/auth.service';
import {User} from '../../../utils/models/User';
import {OrderPostObject, ReportedOrder} from '../../../utils/models/Order';
import {ReportedOrdersListService} from './reported-orders-list.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-reported-orders-list',
  templateUrl: './reported-orders-list.component.html',
  styleUrls: ['./reported-orders-list.component.scss']
})
export class ReportedOrdersListComponent implements OnInit {

  orders: Array<ReportedOrder>;
  currentUser: User;

  constructor(private authService: AuthService, private ordersService: ReportedOrdersListService, private router: Router) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  capitalize(word: string): string {
    return (word.charAt(0).toUpperCase() + word.slice(1)).replace(/-/g, ' ');
  }

  async goTo(location) {
    await this.router.navigate([location]);
  }

}
