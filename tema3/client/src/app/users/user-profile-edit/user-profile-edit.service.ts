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
}
