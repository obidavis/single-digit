import { useCallback, useState } from "react";
import { Board } from "../models";

export const useSudokuHistory = (initialState: Board) => {
  const [history, setHistory] = useState<Board[]>([initialState]);
  const [index, setIndex] = useState(0);

  const currentState = history[index];

  const makeMove = useCallback((newState: Board) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(index + 1);
  }, [history, index]);

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
  