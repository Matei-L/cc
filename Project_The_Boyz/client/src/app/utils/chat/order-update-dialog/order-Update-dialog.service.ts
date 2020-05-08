import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

interface PostFileResponseObject {
  url: string;
  urls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderUpdateDialogService {
  private ordersApi = environment.baseUrl + '/orders';
  private filesApi = environment.baseUrl + '/files';

  constructor(private http: HttpClient) {
  }

  postFiles(files: File[], fileNames: string[]) {
    const fd = new FormData();
    for (const fileIndex in files) {
      fd.append(fileNames[fileIndex], files[fileIndex], fileNames[fileIndex]);
    }
    console.log(fd);
    return this.http.post<PostFileResponseObject>(this.filesApi, fd);
  }

  putOrderUpdate(orderUpdate: object) {
    return this.http.put(this.ordersApi + '/updateStatus', orderUpdate);
  }
}
