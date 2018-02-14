export class MindBalance {
  constructor(
    public date: string,
    public emotions: string,
    public notes: string,
    public stress: number,
    public vikruti: string
  ) { }
}

export interface IEmotion {
  name: string;
  derivatives: string[];
}