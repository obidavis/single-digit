declare type Puzzle = {
  clues: number[];
  solution: number[];
  difficulty: number;
}

declare type DailyPuzzles = {
  date: string;
  easy: Puzzle;
  moderate: Puzzle;
  tough: Puzzle;
}

