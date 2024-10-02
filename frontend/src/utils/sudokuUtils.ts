import { Board, Cell } from '../models/Sudoku';

export function indexToRowIndex(index: number) {
  return Math.floor(index / 9);
}

export function indexToColIndex(index: number) {
  return index % 9;
}

export function indexToBoxIndex(index: number) {
  return Math.floor((index % 9) / 3) + (3 * Math.floor(Math.floor(index / 9) / 3));
}

export const indexToRowAndCol = (index: number) => {
  return {
    row: indexToRowIndex(index),
    col: indexToColIndex(index),
  };
}

export const rowAndColToIndex = (row: number, col: number) => {
  return row * 9 + col;
}

const boardFromShortString = (boardString: string): Board | null => {
  const cells = boardString.split('').map((value, index) => {
    return {
      index,
      value: value === '0' ? 0 : parseInt(value),
      candidates: new Array(9).fill(false),
      isClue: value !== '0',
    };
  });
  return { cells };
};

const boardFromLongString = (boardString: string): Board | null => {
  const bitCount = (n: number) => {
    let count = 0;
    while (n) {
      n &= n - 1;
      count++;
    }
    return count;
  };

  const cells = boardString.match(/.{1,2}/g)?.map((cellStr, index): Cell => {
    let n = parseInt(cellStr, 32);
    const isClue = (n & 1) === 1;
    n >>= 1;
    if (bitCount(n) === 1) {
      return {
        index,
        value: Math.log2(n) + 1,
        candidates: new Array(9).fill(false),
        isClue,
      };
    } else {
      const candidates = new Array(9).fill(false).map((_, i) => {
        return (n & (1 << (i))) !== 0;
      });
      return {
        index,
        value: 0,
        candidates,
        isClue,
      };
    }
  });
  
  if (cells === undefined) {
    return null;
  }

  return { cells };
};

export const boardFromString = (boardString: string): Board | null => {
  // replace all non-alphanumeric characters with 0
  boardString = boardString.replace(/[^0-9a-zA-Z]/g, '0');
  if (boardString.length === 81) {
    return boardFromShortString(boardString);
  } else if (boardString.length === 162) {
    return boardFromLongString(boardString);
  } else {
    return null;
  }
};

export const validateBoardString = (boardString: string): boolean => {
  return boardFromString(boardString) !== null;
}

export const boardToShortString = (board: Board): string => {
  return board.cells.map(cell => cell.isClue ? cell.value : 0).join('');
}

export const boardToLongString = (board: Board): string => {
  return board.cells.map(cell => {
    let n = cell.value ? (1 << cell.value - 1) : 0;
    for (let i = 0; i < 9; i++) {
      n |= cell.candidates[i] ? 1 << i : 0;
    }
    n = (n << 1) + (cell.isClue ? 1 : 0);
    let h = n.toString(32);
    if (h.length < 2) {
      h = '0' + h;
    }
    return h;
  }).join('');
}

export const longToShortString = (longString: string): string => {
  const board = boardFromString(longString);
  if (board === null) {
    return '';
  }
  return boardToShortString(board);
}

const isSameConstrainSet = (index1: number, index2: number) => {
  return indexToRowIndex(index1) === indexToRowIndex(index2) ||
          indexToColIndex(index1) === indexToColIndex(index2) ||
          indexToBoxIndex(index1) === indexToBoxIndex(index2);
}

export const removeSolvedCellsFromCandidates = (board: Board): void => {
  board.cells.filter(cell => cell.value !== 0).forEach((cell1, index1) => {
    board.cells.filter((cell2, index2) => isSameConstrainSet(index1, index2)).forEach(cell2 => {
      cell2.candidates[cell1.value - 1] = false;
    });
  });
}