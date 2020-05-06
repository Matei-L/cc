import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './utils/auth/auth.service';
import {ChatAdapter, ChatParticipantType, IChatController, IChatParticipant, User, ɵa} from 'ng-chat';
import {MyChatAdapter, MyChatParticipant} from './utils/chat/MyChatAdapter';
import {HttpClient} from '@angular/common/http';
import {Window} from 'ng-chat/ng-chat/core/window';
import {IChatOption} from 'ng-chat/ng-chat/core/chat-option';
import {NgChat} from 'ng-chat/ng-chat/ng-chat.component';
import {PaypalDonationComponent} from './utils/paypal/paypal-donation/paypal-donation.component';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderUpdateDialogComponent} from "./utils/chat/order-update-dialog/order-update-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
  title = 'The Boyz';
  userId = '';
  adapter: ChatAdapter;
  @ViewChild('ngChatInstance', {static: false})
  protected ngChatInstance: NgChat;
  private ngChatModified = false;

  constructor(private authService: AuthService, private http: HttpClient, private matDialog: MatDialog, private snackBar: MatSnackBar) {
    authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.adapter = new MyChatAdapter(this.userId, http);
      }
    });
  }

  getMyDefaultWindowOptions(ngChatInstance: NgChat): any {
    return (currentWindow: Window): IChatOption[] => {
      if (currentWindow.participant.participantType === ChatParticipantType.User) {
        return [{
          isActive: false,
          action: (chattingWindow: Window) => {
            setTimeout(() => ngChatInstance.currentActiveOption = null, 1);

            const status = (chattingWindow.participant as MyChatParticipant).statusExplained;
            if ((chattingWindow.participant as MyChatParticipant).role === 'seller') {
              // I am the buyer
              if (status === 'reported' || status === 'finished-and-reported') {
                this.createSnackBar('Already Reported!');
              } else {
                this.openReportDialog(this.userId, chattingWindow.participant.id, status);
              }
            } else {
              // I am the seller
              if (status === 'finished' || status === 'finished-and-reported') {
                this.createSnackBar('Already Finished!');
              } else {
                this.openFinishDialog(this.userId, chattingWindow.participant.id, status);
              }
            }

          },
          validateContext: (participant: IChatParticipant) => {
            return participant.participantType === ChatParticipantType.User;
          },
          displayLabel: ((currentWindow.participant as MyChatParticipant).role === 'seller') ?
            'Report' : 'Finish'
        }];
      }
      return [];
    };
  }

  ngAfterViewChecked(): void {
    if (this.ngChatInstance && !this.ngChatModified) {
      this.ngChatInstance.defaultWindowOptions = this.getMyDefaultWindowOptions(this.ngChatInstance);
      this.ngChatModified = true;
    }
  }

  private createSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  private openReportDialog(buyerId: string, sellerId: string, currentStatus: string) {
    let status;
    if (currentStatus === 'ongoing') {
      status = 'reported';
    } else {
      status = 'finished-and-reported';
    }
    const dialogRef = this.matDialog.open(OrderUpdateDialogComponent, {
      data: {
        buyerId,
        sellerId,
        status
      }
    });
  }

  private openFinishDialog(sellerId: string, buyerId: string, currentStatus: string) {
    let status;
    if (currentStatus === 'ongoing') {
      status = 'finished';
    } else {
      status = 'finished-and-reported';
    }
    const dialogRef = this.matDialog.open(OrderUpdateDialogComponent, {
      data: {
        buyerId,
        sellerId,
        status
      }
    });
  }
}
