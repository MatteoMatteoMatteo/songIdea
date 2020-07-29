export interface Song {
  id?: string;
  name: string;
  genre: string;
  date?: Date;
  state?: "finished" | "needsFeedback" | "onlyIdeas" | null;
}
