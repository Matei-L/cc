import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-order-update-dialog',
  templateUrl: './order-update-dialog.component.html',
  styleUrls: ['./order-update-dialog.component.scss']
})
export class OrderUpdateDialogComponent implements OnInit {

  buyerId: number;
  sellerId: number;
  status: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.buyerId = data.buyerId;
    this.sellerId = data.sellerId;
    this.status = data.status;
  }

  ngOnInit(): void {
  }

}
