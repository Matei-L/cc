import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from '../../utils/models/User';
import {UsersListService} from '../users-list/users-list.service';
import {UserProfileService} from './user-profile-service';
import {AuthService} from '../../utils/auth/auth.service';
import {MatDialog} from "@angular/material/dialog";
import {PaypalDonationComponent} from "../../utils/paypal/paypal-donation/paypal-donation.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userProfileService: UserProfileService,
              private authService: AuthService, private matDialog: MatDialog) {
  }

  uid: string;
  user = {} as User;
  currentUser: User;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.uid = params.uid;
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
      this.userProfileService.getUserDetails(this.uid).subscribe(
        user => {
          this.user = user;
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  onPlay() {
    const dialogRef = this.matDialog.open(PaypalDonationComponent, {
      data: {
        buyer: this.currentUser,
        seller: this.user
      }
    });
  }
}
