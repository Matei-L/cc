import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from '../../utils/auth/User';
import {UsersListService} from '../users-list/users-list.service';
import {UserProfileService} from './user-profile-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userProfileService: UserProfileService) {
  }

  uid: string;
  user: User;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.uid = params.uid;
      this.userProfileService.getUserDetails(this.uid).subscribe(
        user => {
          this.user = user;
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
