import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from '../../utils/models/User';
import {UsersListService} from '../users-list/users-list.service';
import {UserProfileService} from './user-profile-service';
import {AuthService} from "../../utils/auth/auth.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userProfileService: UserProfileService,
              private authService: AuthService) {
  }

  uid: string;
  user: User;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.uid = params.uid;
      const subscription = this.authService.getIdToken().subscribe((token) => {
        this.userProfileService.getUserDetails(this.uid, token).subscribe(
          user => {
            this.user = user;
            subscription.unsubscribe();
          });
      });
    });

  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
