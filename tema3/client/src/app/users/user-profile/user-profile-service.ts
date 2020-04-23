import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../../utils/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getUserDetails(uid) {
    return this.http.get<User>(this.api + '/users/' + uid);
  }
}
