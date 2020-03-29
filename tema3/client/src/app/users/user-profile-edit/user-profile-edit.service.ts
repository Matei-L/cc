import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface TranscriptionObject {
  transcription: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileEditService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  speechToText(blob: Blob) {
    return this.http.post<TranscriptionObject>(this.api + '/speechToText', blob);
  }

  postUserProfile(body) {
    return this.http.post(this.api + '/users', body);
  }

  putUserProfile(body) {
    return this.http.put(this.api + '/users', body);
  }

  postFile(file: File) {
    const fd = new FormData();
    fd.append('file', file, 'file');
    return this.http.post(this.api + '/files', file, {headers: {'Content-Type': undefined}});
  }
}
