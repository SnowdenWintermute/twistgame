export class HighScoreEntry {
  date = Date.now();
  constructor(
    public playerName: string,
    public score: number
  ) {}
}

export class HighScoreManager {
  public scores: HighScoreEntry[] = [];
  constructor() {}

  updateList(name: string, score: number) {
    this.scores.push(new HighScoreEntry(name, score));
  }
}
