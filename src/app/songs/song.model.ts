import { Comment } from "./../comments/comment.model";
export interface Song {
  userId: string;
  songId?: string;
  path: string;
  name: string;
  genre: string;
  date: Date;
  comments?: Comment[];
}
