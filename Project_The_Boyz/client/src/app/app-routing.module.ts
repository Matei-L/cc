import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserProfileEditComponent} from './users/user-profile-edit/user-profile-edit.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {AuthGuard} from './utils/auth/auth.guard';
import {ConfirmOrderComponent} from "./utils/paypal/confirm-order/confirm-order.component";
import {ReportedOrdersListComponent} from "./admin/reportedOrders/reported-orders-list/reported-orders-list.component";
import {ReportedOrderInfoComponent} from "./admin/reportedOrders/reported-order-info/reported-order-info.component";

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users/profile',
    component: UserProfileEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:uid/profile',
    component: UserProfileComponent
  },
  {
    path: 'users',
    component: UsersListComponent,
  },
  {
    path: 'confirmOrder/:buyerUid/:sellerUid/:hash/:nrOfGames',
    component: ConfirmOrderComponent,
  },
  {
    path: 'admin/reportedOrders',
    component: ReportedOrdersListComponent,
  },
  {
    path: 'admin/reportedOrders/:uid',
    component: ReportedOrderInfoComponent,
  },
  {
    path: 'confirmOrder/:buyerUid/:sellerUid/:hash/:nrOfGames',
    component: ConfirmOrderComponent,
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
