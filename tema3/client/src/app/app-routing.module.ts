import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserProfileEditComponent} from './users/user-profile-edit/user-profile-edit.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {AuthGuard} from './utils/auth/auth.guard';

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
