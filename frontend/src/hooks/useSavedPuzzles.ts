import { Board } from "../models/Sudoku";
import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { boardToShortString } from "../utils/sudokuUtils";
// import { boardToLongString } from "../utils/sudokuUtils";

export interface SavedPuzzle {
  lastPlayed: number;
  board: Board;
};

export type SavedPuzzles = Record<string, SavedPuzzle>;

interface SavedPuzzleState {
  savedPuzzles: SavedPuzzles;
  savePuzzle: (state: Board) => void;
  removePuzzle: (key: string) => void;
  // clearSavedPuzzles: () => void;
};

export const useSavedPuzzlesStore = create<SavedPuzzleState>()(
  persist(
    (set, get) => ({
      savedPuzzles: {},

      savePuzzle: (board: Board) => set((state) => {
        const key = boardToShortString(board);
        return {
          savedPuzzles: {
            ...state.savedPuzzles,
            [key]: {
              lastPlayed: new Date().getTime(),
              board,
            },
          },
        };
      }),

      removePuzzle: (key: string) => set((state) => {
        const savedPuzzles = { ...state.savedPuzzles };
        delete savedPuzzles[key];
        return { savedPuzzles };
      }),

    }),
    {
      name: 'savedPuzzles',
    }
  )
);

// const getSavedPuzzles = (): SavedPuzzles => {
//   const savedPuzzles = localStorage.getItem('savedPuzzles');
//   return savedPuzzles ? JSON.parse(savedPuzzles) : {};
// }

// const savePuzzleToStorage = (key: string, board: Board) => {
//   const savedPuzzles = getSavedPuzzles();
//   // const state = boardToLongString(newState);
//   savedPuzzles[key] = {
//     lastPlayed: new Date().getTime(),
//     board,
//   };
//   localStorage.setItem('savedPuzzles', JSON.stringify(savedPuzzles));
// }

// const removePuzzleFromStorage = (key: string) => {
//   const savedPuzzles = getSavedPuzzles();
//   delete savedPuzzles[key];
//   localStorage.setItem('savedPuzzles', JSON.stringify(savedPuzzles));
// }

// const clearSavedPuzzlesFromStorage = () => {
//   localStorage.removeItem('savedPuzzles');
// }

// export const useSavedPuzzles = () => {
//   const [savedPuzzles, setSavedPuzzles] = useState(getSavedPuzzles());
//   useEffect(() => {
//     setSavedPuzzles(getSavedPuzzles());
//   }, []);

//   const savePuzzle = (state: Board) => {
//     const key = state.cells.map(cell => cell.isClue ? cell.value : 0).join('');
//     savePuzzleToStorage(key, state);
//   }

//   const removePuzzle = useCallback((key: string) => {
//     removePuzzleFromStorage(key);
//     setSavedPuzzles(getSavedPuzzles());
//   }, []);

//   const clearSavedPuzzles = useCallback(() => {
//     clearSavedPuzzlesFromStorage();
//     setSavedPuzzles({});
//   }, []);

//   return { savedPuzzles, savePuzzle, removePuzzle, clearSavedPuzzles };
// }



