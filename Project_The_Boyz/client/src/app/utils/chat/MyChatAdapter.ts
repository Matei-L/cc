import {
  ChatAdapter,
  IChatParticipant,
  Message,
  ParticipantResponse
} from 'ng-chat';
import {Observable, of} from 'rxjs';
import {AngularFireDatabase, snapshotChanges} from '@angular/fire/database';
import {delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Order, OrderPostObject} from '../models/Order';

export class MyChatAdapter extends ChatAdapter {

  private api = environment.baseUrl + '/orders';
  private msgApi = environment.baseUrl + '/messages';
  private participants;
  private receivedMessages = [];

  constructor(private userId, private http: HttpClient, public fireDatabase: AngularFireDatabase) {
    super();
    this.fireDatabase.list('orders').snapshotChanges(['child_added']).subscribe((snap) => {
      for (const order of snap) {
        if (order.type === 'child_added') {
          console.log('New order was added');
          const orderObject = order.payload.val() as OrderPostObject;
          console.log(orderObject);
          if (orderObject.buyerUid === userId || orderObject.sellerUid === userId) {
            this.listFriends();
            this.addMessagesObserver(order.key);
          }
        }
      }
    });
    this.http.get<OrderPostObject[]>(this.api).subscribe(orders => {
      orders.forEach((order) => {
        if (order.buyerUid === userId || order.sellerUid === userId) {
          this.addMessagesObserver(order.key);
        }
      });
    });
  }

  addMessagesObserver(key: string): void {
    this.fireDatabase.list('orders/' + key + '/messages').snapshotChanges(['child_added']).subscribe((snap) => {
      snap.forEach((message) => {
        if (message.type === 'child_added') {
          const newMessage = message.payload.val() as Message;
          if (!this.receivedMessages.includes(newMessage) && newMessage.toId === this.userId) {
            console.log('New message received');
            const user = this.participants.find(x => x.id === newMessage.fromId);
            this.onMessageReceived(user, newMessage);
            this.receivedMessages.push(newMessage);
          }
        }
      });
    });
  }

  listFriends(): Observable<ParticipantResponse[]> {
    console.log('List Friends called');
    return this.http.get<IChatParticipant[]>(this.api + '/byUser/' + this.userId).pipe(map(participants => {
      this.participants = participants;
      return participants.map(participant => {
        const participantResponse = new ParticipantResponse();
        participantResponse.participant = participant;
        participantResponse.metadata = {
          totalUnreadMessages: 0
        };
        return participantResponse;
      });
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    console.log('Message history called');
    return this.http.get<Array<Message>>(this.msgApi + '/' + destinataryId).pipe(map(messages => {
      return messages.sort((a, b) => {
        return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
      });
    }));
  }

  sendMessage(message: Message): void {
    this.http.post<string>(this.msgApi + '/' + message.toId, message).subscribe(response => {
      console.log('Posted');
    });
  }
}
