export interface Song {
  userId: string;
  songId?: string;
  path: string;
  name: string;
  genre: string;
  date: Date;
  player?: any;
  videoId: any;
  playerId: any;
  playerHolder: any;
  hearts?: number;
}
