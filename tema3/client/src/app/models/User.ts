export class User {
  constructor(email: string, games: Array<string>, profilePic: string) {
    this.email = email;
    this.games = games;
    this.profilePic = profilePic;
  }

  email: string;
  games: Array<string>;
  profilePic: string;
}
