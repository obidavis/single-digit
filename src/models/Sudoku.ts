export type Cell = {
  index: number;
  value: number;
  candidates: boolean[];
  isClue: boolean;
};

export type Board = {
  cells: Cell[];
}