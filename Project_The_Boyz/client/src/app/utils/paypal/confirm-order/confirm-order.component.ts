import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {OrderPostObject} from '../../models/Order';
import * as uuid from 'uuid';

interface HashCheckResponse {
  ok: boolean;
}

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
  }

  baseUrl = environment.baseUrl;
  buyerUid: string;
  nrOfGames: number;
  sellerUid: string;
  hash: string;
  ok = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.buyerUid = params.buyerUid;
      this.sellerUid = params.sellerUid;
      this.hash = params.hash;
      this.nrOfGames = params.nrOfGames;
      this.http.get<HashCheckResponse>(this.baseUrl + '/hash/check/' + this.buyerUid + '/' +
        this.sellerUid + '/' + this.hash).subscribe(response => {
        this.ok = response.ok;
        if (this.ok) {
          const order = {} as OrderPostObject;
          order.uid = uuid.v4();
          order.buyerUid = this.buyerUid;
          order.sellerUid = this.sellerUid;
          order.status = 'ongoing';
          order.nrOfGames = this.nrOfGames;
          this.http.post(this.baseUrl + '/orders', order).subscribe(_ => {
            this.router.navigate(['/']);
          });
        }
      });
    });
  }

}
