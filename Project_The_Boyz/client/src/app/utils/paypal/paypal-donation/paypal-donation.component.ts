import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '../../models/User';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';


interface HashResponse {
  hash: string;
}

@Component({
  selector: 'app-paypal-donation',
  templateUrl: './paypal-donation.component.html',
  styleUrls: ['./paypal-donation.component.scss']
})
export class PaypalDonationComponent implements OnInit {

  baseUrl = environment.baseUrl;
  clientUrl = environment.clientUrl;
  buyer = {} as User;
  seller = {} as User;
  nrOfGames = 1;
  hash: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
    this.buyer = data.buyer;
    this.seller = data.seller;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.http.get<HashResponse>(this.baseUrl + '/hash/' + this.buyer.uid + '/' + this.seller.uid)
      .subscribe(response => {
        this.hash = response.hash;
        console.log('/confirmOrder/' + this.buyer.uid + '/' + this.seller.uid + '/' + this.hash);
        (document.getElementById('form') as HTMLFormElement).submit(); // -- uncomment to redirect to paypal
      });
  }
}
