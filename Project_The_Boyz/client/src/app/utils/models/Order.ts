import {User} from './User';
import {Message} from 'ng-chat';

export interface OrderPostObject {
  key: string;
  uid: string;
  buyerUid: string;
  sellerUid: string;
  status: string;
  nrOfGames: number;
  messages: Array<Message>;
}

export interface Order {
  uid: string;
  buyer: User;
  seller: User;
  status: string;
}
