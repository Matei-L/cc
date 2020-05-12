import {Component, OnInit} from '@angular/core';
import {User} from '../../../utils/models/User';
import {AuthService} from '../../../utils/auth/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportedOrder} from '../../../utils/models/Order';
import {ReportedOrderInfoService} from './reported-order-info.service';
import {Message} from 'ng-chat';

@Component({
  selector: 'app-reported-order-info',
  templateUrl: './reported-order-info.component.html',
  styleUrls: ['./reported-order-info.component.scss']
})
export class ReportedOrderInfoComponent implements OnInit {
  private routeSub: Subscription;
  currentUser: User;
  messages: Array<Message>;

  order: ReportedOrder;

  constructor(private route: ActivatedRoute, private authService: AuthService, private orderService: ReportedOrderInfoService, private router: Router) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.orderService.getOrder(params.uid).subscribe(order => {
        this.order = order;
        this.messages = order.messages;
        this.messages.sort((a, b) => {
          return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
        });
      });
    });
  }

  capitalize(word: string): string {
    return (word.charAt(0).toUpperCase() + word.slice(1)).replace('-', ' ');
  }

  sendMailTo(email: string) {
    window.open(`mailto:${email}?subject=The Boyz Support - Reported order`);
  }

  markAsFinished(): void {
    this.orderService.markAsFinished(this.order.uid).subscribe(res => {
      this.router.navigate(['/admin/reportedOrders']);
    });
  }

}
