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