import {Component} from '@angular/core';
import {AuthService} from './utils/auth/auth.service';
import {ChatAdapter} from 'ng-chat';
import {MyChatAdapter} from './utils/chat/MyChatAdapter';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'The Boyz';
  userId = '';
  public adapter: ChatAdapter;

  constructor(private authService: AuthService, private http: HttpClient) {
    authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.adapter = new MyChatAdapter(this.userId, http);
      }
    });
  }
}
