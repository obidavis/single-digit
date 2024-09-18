import { useCallback, useEffect, useRef, useState } from 'react'
import { BoardView, BoardViewProps } from './BoardView'
import { Cell, Board, boardFromString } from '../../models';
import { Controls, ControlsProps } from './SudokuControls';
import { useSudoku } from '../../hooks/useSudoku';
import { useArrowInput, useNumberInput } from '../../hooks/useSudokuEvents';
import { indexToRowAndCol, rowAndColToIndex } from '../../utils/sudokuUtils';

export interface SudokuPlayerProps {
  initialState: Board | string;
};

export const SudokuPlayer = ({ initialState }: SudokuPlayerProps) => {
  const board = typeof (initialState) == 'string' ? boardFromString(initialState) : initialState;
  const { 
    currentState, 
    selectedIndex,
    setSelectedIndex,
    setCellValue, 
    toggleCandidate,
    undo,
    redo, 
    canUndo,
    canRedo,
    canErase  
  } = useSudoku(board);

  const [isNoteMode, setIsNoteMode] = useState(false);

  const selectedIndexRef = useRef(selectedIndex);
  const isNoteModeRef = useRef(isNoteMode);
  const toggleCandidateRef = useRef(toggleCandidate);
  const setCellValueRef = useRef(setCellValue);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    isNoteModeRef.current = isNoteMode;
    toggleCandidateRef.current = toggleCandidate;
    setCellValueRef.current = setCellValue;
  }, [selectedIndex, isNoteMode, toggleCandidate, setCellValue]);

  const handleNumberInput = useCallback((value: number) => {
    if (isNoteModeRef.current) {
      toggleCandidateRef.current(value - 1);
    } else {
      setCellValueRef.current(value);
    }
  }, []);

  useNumberInput((value: number) => handleNumberInput(value));
  useArrowInput((dx: number, dy: number) => {
    if (selectedIndexRef.current !== null) {
      const { row, col } = indexToRowAndCol(selectedIndexRef.current);
      const newRow = (row + dy + 9) % 9;
      const newCol = (col + dx + 9) % 9;
      const newIndex = rowAndColToIndex(newRow, newCol);
      setSelectedIndex(newIndex);
    }
  });

  // Props to pass to board
  const boardProps: BoardViewProps = {
    board: currentState,
    selectedIndex: selectedIndex,
    onCellClick: (cell: Cell) => setSelectedIndex(cell.index)
  };


  const controlsProps: ControlsProps = {
    isNoteMode: isNoteMode,
    canErase: canErase,
    canUndo: canUndo,
    canRedo: canRedo,
    currentSelection: // candidates if we have a valid, unsolved selected cell, otherwise blank
      (selectedIndex !== null && currentState.cells[selectedIndex].value === 0)
        ? currentState.cells[selectedIndex].candidates
        : Array(9).fill(false),
    onSelectNumber: handleNumberInput,
    onErase: () => handleNumberInput(0),
    onNoteToggle: () => setIsNoteMode(!isNoteMode),
    onRedo: redo,
    onUndo: undo
  };

  return (
    <div className='sudoku'>
      <div className='board-container'>
        <BoardView {...boardProps} />
      </div>
      <div className='controls-container'>
        <Controls {...controlsProps} />
      </div>
    </div>
  )
}

export { SudokuPlayer as Sudoku };