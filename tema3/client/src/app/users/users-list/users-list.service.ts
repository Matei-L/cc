import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../../utils/models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersListService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getUsers() {
    return this.http.get<User[]>(this.api + '/users');
  }
}
