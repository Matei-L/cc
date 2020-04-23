import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserProfileEditComponent} from './users/user-profile-edit/user-profile-edit.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: 'users/profile',
    component: UserProfileEditComponent,
    canActivate: [MsalGuard]
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
