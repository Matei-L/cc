import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '../../models/User';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';


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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private router: Router) {
    this.buyer = data.buyer;
    this.seller = data.seller;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.http.get<HashResponse>(this.baseUrl + '/hash/' + this.buyer.uid + '/' + this.seller.uid)
      .subscribe(response => {
        if (response) {
          if (response.hash) {
            this.hash = response.hash;
            const els = document.getElementsByName('return');
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < els.length; i++) {
              // console.log('Before: ' + (els[i] as HTMLInputElement).value);
              (els[i] as HTMLInputElement).value =
                `${this.clientUrl}/confirmOrder/${this.buyer.uid}/${this.seller.uid}/${this.hash}/${this.nrOfGames}`;
              // console.log('After: ' + (els[i] as HTMLInputElement).value);
            }
            setTimeout(() => {
              (document.getElementById('form') as HTMLFormElement).submit(); // -- uncomment to redirect to paypal}
            }, 2500);
            // this.router.navigate(
            //   ['/confirmOrder/' + this.buyer.uid + '/' + this.seller.uid + '/' + this.hash + '/' + this.nrOfGames]
            // );
          }
        }
      });
  }
}
