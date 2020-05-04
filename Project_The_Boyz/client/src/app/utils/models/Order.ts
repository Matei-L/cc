import {User} from './User';

export interface OrderPostObject {
  uid: string;
  buyerUid: string;
  sellerUid: string;
  status: string;
}

export interface Order {
  uid: string;
  buyer: User;
  seller: User;
  status: string;
}
