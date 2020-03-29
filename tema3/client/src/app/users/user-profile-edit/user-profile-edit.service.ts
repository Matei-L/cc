import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

interface TranscriptionObject {
  transcription: string;
}

interface PostFileResponseObject {
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileEditService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  speechToText(blob: Blob): Observable<TranscriptionObject> {
    return this.http.post<TranscriptionObject>(this.api + '/speechToText', blob);
  }

  postUserProfile(body) {
    return this.http.post(this.api + '/users', body);
  }

  putUserProfile(body) {
    return this.http.put(this.api + '/users', body);
  }

  postFile(file: File, newFilename: string): Observable<PostFileResponseObject> {
    const fd = new FormData();
    fd.append('file', file, newFilename);
    return this.http.post<PostFileResponseObject>(this.api + '/files', fd);
  }
}
