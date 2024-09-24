import { useCallback, useEffect, useState } from 'react'
import { BoardView, BoardViewProps } from './BoardView'
import { Cell, Board } from '../../models/Sudoku';
import { Controls, ControlsProps } from './Controls';
import { produce } from 'immer';
import { useHistoryState } from '@uidotdev/usehooks';
import { indexToRowAndCol, rowAndColToIndex } from '../../utils/sudokuUtils';
import { useSavedPuzzles } from '../../hooks/useSavedPuzzles';
import "./Sudoku.scss";


export interface SudokuParams {
  initialState: Board;
}

export const SudokuPlayer = ({ initialState }: SudokuParams) => {
  const { state, undo, redo, canRedo, canUndo, set, clear } = useHistoryState<Board>(initialState);
  useEffect(() => {
    clear();
    set(initialState);
  }, [initialState, set, clear]);
  const { savePuzzle } = useSavedPuzzles();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);

  const setCellValue = useCallback((value: number) => {
    if (selectedIndex !== null) {
      const newBoard = produce(state, draft => {
        draft.cells[selectedIndex].value = value;
        draft.cells[selectedIndex].candidates = Array(9).fill(false);
      });
      set(newBoard);
      savePuzzle(newBoard);
    }
  }, [selectedIndex, state, set, savePuzzle]);

  const toggleCandidate = useCallback((candidate: number) => {
    if (selectedIndex !== null) {
      const newBoard = produce(state, draft => {
        draft.cells[selectedIndex].value = 0;
        draft.cells[selectedIndex].candidates[candidate - 1] = !draft.cells[selectedIndex].candidates[candidate - 1];
      });
      set(newBoard);
      savePuzzle(newBoard);
    }
  }, [selectedIndex, state, set, savePuzzle]);

  const handleNumberInput = useCallback((value: number) => {
    if (isNoteMode) {
      toggleCandidate(value);
    }
    else {
      setCellValue(value);
    }
  }, [isNoteMode, setCellValue, toggleCandidate]);

  const eraseCell = useCallback(() => {
    if (selectedIndex !== null) {
      const newBoard = produce(state, draft => {
        const cell = draft.cells[selectedIndex];
        if (!cell.isClue) {
          cell.value = 0;
          cell.candidates = Array(9).fill(false);
        }
      });
      set(newBoard);
    }
  }, [selectedIndex, state, set]);

  const handleNoteModeToggle = useCallback(() => {
    setIsNoteMode(!isNoteMode);
  }, [isNoteMode]);

  const advanceToNextCell = useCallback(() => { 
    const index = selectedIndex === null ? 0 : selectedIndex + 1;
    const reordered = state.cells.slice(index).concat(state.cells.slice(0, index));
    const nextIndex = reordered.findIndex(cell => cell.value === 0);
    if (nextIndex !== -1) {
      setSelectedIndex(reordered[nextIndex].index);
    }
  }, [selectedIndex, state]);

  const retreatToPrevCell = useCallback(() => {
    const index = selectedIndex === null ? 0 : selectedIndex;
    const reordered = state.cells.slice(index).concat(state.cells.slice(0, index));
    const prevIndex = reordered.slice().reverse().findIndex(cell => cell.value === 0);
    if (prevIndex !== -1) {
      setSelectedIndex(reordered[reordered.length - prevIndex - 1].index);
    }
  }, [selectedIndex, state]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '9') {
        handleNumberInput(parseInt(event.key));
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        eraseCell();
      } else if (event.key === '.') {
        advanceToNextCell();
      } else if (event.key === ',') {
        retreatToPrevCell();
      } else if (event.key === 'n') {
        handleNoteModeToggle();
      } else if (event.key === 'z' && event.ctrlKey) {
        undo();
      } else if (event.key === 'y' && event.ctrlKey) {
        redo();
      } else if (selectedIndex !== null) {
        let { row, col } = indexToRowAndCol(selectedIndex);
        if (event.key === 'ArrowLeft') {
          col = (col + 8) % 9;
        } else if (event.key === 'ArrowRight') {
          col = (col + 1) % 9;
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          row = (row + 8) % 9;
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          row = (row + 1) % 9;
        }
        setSelectedIndex(rowAndColToIndex(row, col));
      }
    };

    window.addEventListener('keydown', keyDownHandler);

    return () => window.removeEventListener('keydown', keyDownHandler);
  }, [eraseCell, handleNumberInput, advanceToNextCell, retreatToPrevCell, handleNoteModeToggle, selectedIndex, setSelectedIndex, undo, redo]);

  const boardProps: BoardViewProps = {
    board: state,
    selectedIndex: selectedIndex,
    onCellClick: (cell: Cell) => setSelectedIndex(cell.index)
  };

  const currentSelection = selectedIndex !== null ? state.cells[selectedIndex].candidates : Array(9).fill(false);

  const controlsProps: ControlsProps = {
    isNoteMode: isNoteMode,
    canErase: true,
    canUndo: canUndo,
    canRedo: canRedo,
    currentSelection: currentSelection,
    onSelectNumber: handleNumberInput,
    onErase: eraseCell,
    onNoteToggle: handleNoteModeToggle,
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