import {Game} from './Game';

export interface User {
  uid: string;
  email: string;
  nickname: string;
  description: string;
  photoUrl: string;
  audioUrl: string;
  games: Array<Game>;
}
