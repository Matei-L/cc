import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileEditService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  speechToText(file: File) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', null);
    headers.append('Accept', 'application/json');
    const options =  {
      headers
    };

    const fd = new FormData();
    fd.append('audio', file);
    return this.http.post(this.api + '/speechToText', fd, options);
  }
}
