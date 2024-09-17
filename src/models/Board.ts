import { Cell } from './Cell';

export class Board {
  cells: Cell[];
  constructor(cells: Cell[]) {
    this.cells = cells;
  }

  clone(): Board {
    return new Board(this.cells.map(cell => cell.clone()));
  }
}

export function boardFromString(boardString: string): Board {
  const cells = boardString.split('').map((value, index) => {
    return new Cell({
      index,
      value: value === '0' ? 0 : parseInt(value),
      candidates: new Array(9).fill(false),
      isClue: value !== '0'
    });
  });
  return new Board(cells);
}
