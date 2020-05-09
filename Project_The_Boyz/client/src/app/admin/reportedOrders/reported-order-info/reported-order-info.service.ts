import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ReportedOrder} from '../../../utils/models/Order';

@Injectable({
  providedIn: 'root'
})
export class ReportedOrderInfoService {
  private api = environment.baseUrl + '/orders';

  constructor(private http: HttpClient) {
  }

  getOrder(uid: string) {
    return this.http.get<ReportedOrder>(this.api + '/' + uid);
  }
}
