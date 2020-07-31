export interface Song {
  userId: string;
  songId?: string;
  name: string;
  genre: string;
  date?: Date;
  state?: "finished" | "needsFeedback" | "onlyIdeas" | null;
}
