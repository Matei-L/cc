import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {UserProfileEditComponent} from './users/user-profile-edit/user-profile-edit.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {AudioRecordingService} from './audio-recording.service';
import {AuthGuard} from './utils/auth/auth.guard';

import {config} from './firebaseConfig';
import {MatListModule} from '@angular/material/list';
import {TokenInterceptor} from './utils/auth/token.interceptor';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PaypalDonationComponent } from './utils/paypal/paypal-donation/paypal-donation.component';
import { ConfirmOrderComponent } from './utils/paypal/confirm-order/confirm-order.component';
import {NgChatModule} from 'ng-chat';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UsersListComponent,
    UserProfileEditComponent,
    UserProfileComponent,
    PaypalDonationComponent,
    ConfirmOrderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    MatListModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    NgChatModule
  ],
  providers: [
    AudioRecordingService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
