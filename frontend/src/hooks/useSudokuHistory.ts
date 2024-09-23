import { useCallback, useEffect, useState } from "react";
import { Board } from "../models/Sudoku";
import { useSavedPuzzles } from "./useSavedPuzzles";

export const useSudokuHistory = (initialState: Board) => {
  const [currentState, setCurrentState] = useState(initialState);
  useEffect(() => {
    setCurrentState(initialState);
  }, [initialState]);

  const [history, setHistory] = useState<Board[]>([currentState]);
  const { savePuzzle } = useSavedPuzzles();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setCurrentState(history[index]);
  }, [index, history]);

  const makeMove = useCallback((newState: Board) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(index + 1);
    savePuzzle(newState);
  }, [history, index, savePuzzle]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
    }
  }, [index, history]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { currentState, makeMove, undo, redo, canUndo, canRedo };
};
  