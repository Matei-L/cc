import {
  ChatAdapter,
  IChatParticipant,
  Message,
  ParticipantResponse
} from 'ng-chat';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


export interface MyChatParticipant extends IChatParticipant {
  role: string;
  statusExplained: string;
}

export class MyChatAdapter extends ChatAdapter {

  private api = environment.baseUrl + '/orders';

  constructor(private userId, private http: HttpClient) {
    super();
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return this.http.get<MyChatParticipant[]>(this.api + '/byUser/' + this.userId).pipe(map(participants => {
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
    let mockedHistory: Array<Message>;

    mockedHistory = [
      {
        fromId: 1,
        toId: this.userId,
        message: 'Hi there, just type any message bellow to test this Angular module.',
        dateSent: new Date()
      }
    ];

    return of(mockedHistory).pipe(delay(2000));
  }

  sendMessage(message: Message): void {
    setTimeout(() => {
      const replyMessage = new Message();

      replyMessage.message = 'You have typed \'' + message.message + '\'';
      replyMessage.dateSent = new Date();
      replyMessage.fromId = message.toId;
      replyMessage.toId = message.fromId;

      // const user = MyChatAdapter.mockedParticipants.find(x => x.id === replyMessage.fromId);

      // this.onMessageReceived(user, replyMessage);

    }, 1000);
  }
}
