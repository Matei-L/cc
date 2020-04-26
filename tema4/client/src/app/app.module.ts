import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
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

import {MatListModule} from '@angular/material/list';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { msalConfig, isIE, apiConfig } from './utils/auth/config';



@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PageNotFoundComponent,
    UsersListComponent,
    UserProfileEditComponent,
    UserProfileComponent,
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
    MatListModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MsalModule.forRoot(msalConfig, {
        popUp: !isIE,
        consentScopes: apiConfig.b2cScopes,
        unprotectedResources: [],
        protectedResourceMap: [
            [apiConfig.webApi, apiConfig.b2cScopes]
        ],
        extraQueryParameters: {},
      })
  ],
  providers: [
    AudioRecordingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
