import { create } from 'zustand';
import produce from 'immer';
import { SudokuGameState } from '../models/Sudoku';

interface SudokuStore {
  gameState: SudokuGameState;
  setGameState: (state: SudokuGameState) => void;

  selectedCellIndex?: number;
  setSelectedCellIndex: (index: number) => void;
  
  isNoteMode: boolean;
  setIsNoteMode: (isNoteMode: boolean) => void;
  
  setCellValue: (value: number) => void;
  setCellCandidates: (candidates: boolean[]) => void;
  // toggleCandidate: (candidate: number) => void;
}

export const useSudokuStore = create<SudokuStore>((set) => ({
    gameState: {
      puzzle: {
        clues: "",
        solution: "",
        difficulty: 0,
      },
      cells: [],
      solved: false,
      lastPlayed: 0,
    },
    setGameState: (state: SudokuGameState) => set({ gameState: state }),

    selectedCellIndex: undefined,
    setSelectedCellIndex: (index: number) => set({ selectedCellIndex: index }),

    isNoteMode: false,
    setIsNoteMode: (isNoteMode: boolean) => {set({ isNoteMode: isNoteMode })},

    setAutoCandidates: (autoCandidates: boolean) => {},

    setCellValue: (value: number) => set((state) => {
      if (state.selectedCellIndex === undefined) {
        return { gameState: state.gameState };
      }
      if (state.gameState.cells[state.selectedCellIndex].isClue) {
        return { gameState: state.gameState };
      }
      const newGameState = produce(state.gameState, draft => {
        draft.cells[state.selectedCellIndex!].value = value;
        draft.cells[state.selectedCellIndex!].candidates = Array(9).fill(false);
        draft.lastPlayed = new Date().getTime();
      });
      return ({ gameState: newGameState });
    }),

    toggleCandidate: (candidate: number) => {},
    setCellCandidates: (candidates: boolean[]) => set((state) => {
      if (state.selectedCellIndex === undefined) {
        return { gameState: state.gameState };
      }
      if (state.gameState.cells[state.selectedCellIndex].isClue) {
        return { gameState: state.gameState };
      }
      const newGameState = produce(state.gameState, draft => {
        draft.cells[state.selectedCellIndex!].value = 0;
        draft.cells[state.selectedCellIndex!].candidates = candidates;
        draft.lastPlayed = new Date().getTime();
      });
      return { gameState: newGameState };
    }),

  }));


