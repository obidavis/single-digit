export function indexToRowIndex(index: number) {
  return Math.floor(index / 9);
}

export function indexToColIndex(index: number) {
  return index % 9;
}

export function indexToBoxIndex(index: number) {
  return Math.floor((index % 9) / 3) + (3 * Math.floor(Math.floor(index / 9) / 3));
}