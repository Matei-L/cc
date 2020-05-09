import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OrderPostObject, ReportedOrder} from '../../../utils/models/Order';

@Injectable({
  providedIn: 'root'
})
export class ReportedOrdersListService {
  private api = environment.baseUrl + '/orders';

  constructor(private http: HttpClient) {
  }

  getOrders() {
    return this.http.get<Array<ReportedOrder>>(this.api + '/reported');
  }
}
