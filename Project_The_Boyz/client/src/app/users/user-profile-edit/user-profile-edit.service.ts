import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Game} from '../../utils/models/Game';

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

  putUserProfile(body) {
    return this.http.put(this.api + '/users', body);
  }

  postFile(file: File, newFilename: string): Observable<PostFileResponseObject> {
    const fd = new FormData();
    fd.append('file', file, newFilename);
    return this.http.post<PostFileResponseObject>(this.api + '/files', fd);
  }

  getGames() {
    return this.http.get<Game[]>(this.api + '/games');
  }
}
