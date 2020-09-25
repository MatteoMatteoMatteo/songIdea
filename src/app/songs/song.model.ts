export interface Song {
  userId: string;
  songId?: string;
  name: string;
  genre: string;
  date: Date;
  player?: any;
  videoId: any;
  playerHolder?: any;
  hearts: number;
  heartedBy: string[];
  isHearted?: boolean;
  url: string;
  dropTime: number;
}
