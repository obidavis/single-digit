import { Board } from "../models/Sudoku";
import { useCallback, useEffect, useState } from "react";
import { boardToLongString } from "../utils/sudokuUtils";

export interface SavedPuzzle {
  lastPlayed: number;
  state: string;
};

export interface SavedPuzzles {
  [key: string]: SavedPuzzle;
};

const getSavedPuzzles = (): SavedPuzzles => {
  const savedPuzzles = localStorage.getItem('savedPuzzles');
  return savedPuzzles ? JSON.parse(savedPuzzles) : {};
}

const savePuzzleToStorage = (key: string, newState: Board) => {
  const savedPuzzles = getSavedPuzzles();
  const state = boardToLongString(newState);
  savedPuzzles[key] = {
    lastPlayed: new Date().getTime(),
    state,
  };
  localStorage.setItem('savedPuzzles', JSON.stringify(savedPuzzles));
}

const removePuzzleFromStorage = (key: string) => {
  const savedPuzzles = getSavedPuzzles();
  delete savedPuzzles[key];
  localStorage.setItem('savedPuzzles', JSON.stringify(savedPuzzles));
}

const clearSavedPuzzlesFromStorage = () => {
  localStorage.removeItem('savedPuzzles');
}

export const useSavedPuzzles = () => {
  const [savedPuzzles, setSavedPuzzles] = useState(getSavedPuzzles());
  useEffect(() => {
    setSavedPuzzles(getSavedPuzzles());
  }, []);

  const savePuzzle = (state: Board) => {
    const key = state.cells.map(cell => cell.isClue ? cell.value : 0).join('');
    savePuzzleToStorage(key, state);
  }

  const removePuzzle = useCallback((key: string) => {
    removePuzzleFromStorage(key);
    setSavedPuzzles(getSavedPuzzles());
  }, []);

  return { savedPuzzles, savePuzzle, removePuzzle };
}



