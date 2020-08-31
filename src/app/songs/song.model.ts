export interface Song {
  userId: string;
  songId?: string;
  path: string;
  name: string;
  genre: string;
  date: Date;
  player?: any;
}
