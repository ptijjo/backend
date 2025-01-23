export interface Event {
  id?: string;
  name: string;
  description: string;
  location: string;
  date: Date;
  category: string;
  poster: string;
  views: number;
  authorId: string;
}
