export class Cell {
  index: number;
  value: number;
  candidates: boolean[];
  isClue: boolean;
  constructor({ index, value, candidates, isClue }: { index: number, value: number, candidates: boolean[], isClue: boolean }) {
    this.index = index;
    this.value = value;
    this.candidates = candidates;
    this.isClue = isClue;
  }

  isSolved(): boolean {
    return this.value > 0;
  }

  solve(value: number) {
    this.value = value;
    this.candidates = new Array(9).fill(false);
  }

  setCandidate(index: number, value: boolean) {
    this.candidates[index] = value;
  }

  toggleCandidate(index: number) {
    this.candidates[index] = !this.candidates[index];
  }

  clone(): Cell {
    return new Cell({
      index: this.index,
      value: this.value,
      candidates: this.candidates.slice(),
      isClue: this.isClue
    });
  }
}