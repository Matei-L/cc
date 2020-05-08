import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './utils/auth/auth.service';
import {ChatAdapter, ChatParticipantType, IChatController, IChatParticipant, User, ɵa} from 'ng-chat';
import {MyChatAdapter, MyChatParticipant} from './utils/chat/MyChatAdapter';
import {HttpClient} from '@angular/common/http';
import {Window} from 'ng-chat/ng-chat/core/window';
import {IChatOption} from 'ng-chat/ng-chat/core/chat-option';
import {NgChat} from 'ng-chat/ng-chat/ng-chat.component';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderUpdateDialogComponent} from "./utils/chat/order-update-dialog/order-update-dialog.component";
import {AngularFireDatabase} from '@angular/fire/database';

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

  constructor(private authService: AuthService, private http: HttpClient, private fireDatabase: AngularFireDatabase, private matDialog: MatDialog, private snackBar: MatSnackBar) {
    authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.adapter = new MyChatAdapter(this.userId, http, fireDatabase);
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
            const orderUid = (chattingWindow.participant as MyChatParticipant).orderUid;
            if ((chattingWindow.participant as MyChatParticipant).role === 'seller') {
              // I am the buyer
              if (status === 'reported' || status === 'finished-and-reported') {
                this.createSnackBar('Already Reported!');
              } else {
                this.openReportDialog(orderUid, this.userId, chattingWindow.participant.id, status,
                  chattingWindow.participant.displayName, chattingWindow.participant.avatar);
              }
            } else {
              // I am the seller
              if (status === 'finished' || status === 'finished-and-reported') {
                this.createSnackBar('Already Finished!');
              } else {
                this.openFinishDialog(orderUid, this.userId, chattingWindow.participant.id, status,
                  chattingWindow.participant.displayName, chattingWindow.participant.avatar);
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

  private openReportDialog(orderUid: string, buyerId: string, sellerId: string, currentStatus: string, participantNickname: string,
                           participantAvatar: string) {
    let status;
    if (currentStatus === 'ongoing') {
      status = 'reported';
    } else {
      status = 'finished-and-reported';
    }
    const requestType = 'report';
    const dialogRef = this.matDialog.open(OrderUpdateDialogComponent, {
      data: {
        requestType,
        orderUid,
        buyerId,
        sellerId,
        status,
        participantNickname,
        participantAvatar
      }
    });
  }

  private openFinishDialog(orderUid: string, sellerId: string, buyerId: string, currentStatus: string, participantNickname: string,
                           participantAvatar: string) {
    let status;
    if (currentStatus === 'ongoing') {
      status = 'finished';
    } else {
      status = 'finished-and-reported';
    }
    const requestType = 'finish';
    const dialogRef = this.matDialog.open(OrderUpdateDialogComponent, {
      data: {
        requestType,
        orderUid,
        buyerId,
        sellerId,
        status,
        participantNickname,
        participantAvatar
      }
    });
  }
}
