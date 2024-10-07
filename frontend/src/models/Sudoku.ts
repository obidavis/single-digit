import { Puzzle } from "./SudokuAPI";

declare type SudokuCell = {
  index: number;
  value: number;
  candidates: boolean[];
  isClue: boolean;
};

declare type SudokuGameState = {
  puzzle: Puzzle;
  cells: SudokuCell[];
  solved: boolean;
  lastPlayed: number;
};

export const freshGameState = (puzzle: Puzzle): SudokuGameState => {
  const cells = puzzle.clues.split("").map((char, index): SudokuCell => {
    const value = char < "1" || char > "9" ? 0 : parseInt(char);
    return {
      index,
      value,
      candidates: new Array(9).fill(false),
      isClue: value !== 0,
    };
  });
  return { puzzle, cells, solved: false, lastPlayed: new Date().getTime() };
}

export type { SudokuCell, SudokuGameState };