import { useCallback, useState } from "react";
import { Cell, Board } from "../models";
import { useSudokuHistory } from "./useSudokuHistory";

export const useSudoku = (initialState: Board) => {
  const { currentState, makeMove, undo, redo, canUndo, canRedo } = useSudokuHistory(initialState);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const setCellValue = useCallback((value: number) => {
    if (selectedIndex === null) return;
    const newBoard = currentState.clone();
    newBoard.cells[selectedIndex].value = value;
    makeMove(newBoard);
  }, [selectedIndex, currentState, makeMove]);

  const setCellCandidates = useCallback((candidates: boolean[]) => {
    if (selectedIndex === null) return;
    const newBoard = currentState.clone();
    newBoard.cells[selectedIndex].candidates = candidates;
    makeMove(newBoard);
  }, [selectedIndex, currentState, makeMove]);

  const toggleCandidate = useCallback((index: number) => {
    if (selectedIndex === null) return;
    const newBoard = currentState.clone();
    newBoard.cells[selectedIndex].toggleCandidate(index);
    makeMove(newBoard);
  }, [selectedIndex, currentState, makeMove]);

  const selectedCell = selectedIndex !== null ? currentState.cells[selectedIndex] : null;
  const canErase = (selectedCell !== null) 
                && !selectedCell.isClue 
                && (selectedCell.value > 0 || selectedCell.candidates.some(c => c));

  return { 
    currentState, 
    selectedIndex,
    setSelectedIndex,
    setCellValue, 
    setCellCandidates, 
    toggleCandidate, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    canErase
  };
}