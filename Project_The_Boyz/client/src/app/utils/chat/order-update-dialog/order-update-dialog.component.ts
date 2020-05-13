import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {User} from "../../models/User";
import {AuthService} from "../../auth/auth.service";
import {OrderUpdateDialogService} from "./order-Update-dialog.service";
import {strict} from "assert";

@Component({
  selector: 'app-order-update-dialog',
  templateUrl: './order-update-dialog.component.html',
  styleUrls: ['./order-update-dialog.component.scss']
})
export class OrderUpdateDialogComponent implements OnInit {

  orderUid: string;
  buyerId: number;
  sellerId: number;
  status: string;
  participantNickname: string;
  participantAvatar: string;
  isReporting = false;
  message: string;
  requestType: string;

  public dropFiles: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.dropFiles = files;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OrderUpdateDialogComponent>,
              private authService: AuthService, private orderUpdateDialogService: OrderUpdateDialogService) {
    this.requestType = data.requestType;
    this.buyerId = data.buyerId;
    this.sellerId = data.sellerId;
    this.status = data.status;
    this.orderUid = data.orderUid;
    this.participantNickname = data.participantNickname;
    this.participantAvatar = data.participantAvatar;
    if (this.status === 'reported' || this.status === 'finished-and-reported') {
      this.isReporting = true;
    }
  }

  ngOnInit(): void {
  }

  onSend() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const files = [];
        const fileNames = [];
        for (const droppedFile of this.dropFiles) {
          if (droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
              files.push(file);
              fileNames.push(user.email + '~' + file.name);
            });
          }
        }
        this.orderUpdateDialogService.postFiles(files, fileNames).subscribe(response => {
          let urls;
          if (response.url) {
            urls = [response.url];
          } else {
            urls = response.urls;
          }
          const orderUpdate = {
            orderUid: this.orderUid,
            finishedUrls: [],
            reportedUrls: [],
            finishedMessage: '',
            reportedMessage: '',
            status: this.status
          };
          if (this.requestType === 'finish') {
            orderUpdate.finishedUrls = urls;
            orderUpdate.finishedMessage = this.message;
            orderUpdate.reportedUrls = undefined;
            orderUpdate.reportedMessage = undefined;
          } else {
            orderUpdate.finishedUrls = undefined;
            orderUpdate.finishedMessage = undefined;
            orderUpdate.reportedUrls = urls;
            orderUpdate.reportedMessage = this.message;
          }
          this.orderUpdateDialogService.putOrderUpdate(orderUpdate).subscribe(orderResponse => {
            this.dialogRef.close();
          });
        });
      }
    });
  }
}
