import {User} from '../utils/models/User';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  postUser(user: User) {
    return this.http.post(this.api + `/users`, user);
  }
}
