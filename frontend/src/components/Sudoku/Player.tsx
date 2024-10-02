import { useCallback, useEffect, useState } from 'react'
import { BoardView, BoardViewProps } from './BoardView'
import { Cell, Board } from '../../models/Sudoku';
import { Controls, ControlsProps } from './Controls';
import { produce } from 'immer';
import { useHistoryState } from '@uidotdev/usehooks';
import { indexToBoxIndex, indexToRowAndCol, indexToRowIndex, rowAndColToIndex, indexToColIndex, removeSolvedCellsFromCandidates } from '../../utils/sudokuUtils';
import { useSavedPuzzles } from '../../hooks/useSavedPuzzles';


export interface SudokuParams {
  initialState: Board;
}

interface InProgressPuzzle {
  state: Board;

}

export const SudokuPlayer = ({ initialState }: SudokuParams) => {
  const { state, undo, redo, canRedo, canUndo, set, clear } = useHistoryState<Board>(initialState);
  useEffect(() => {
    clear();
    set(initialState);
  }, [initialState, set, clear]);
  const { savePuzzle } = useSavedPuzzles();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [autoCandidates, setAutoCandidates] = useState(false);

  const applyAutoCandidates = useCallback(() => {
    if (!autoCandidates) {
      return;
    }
    const newBoard = produce(state, draft => {
      draft.cells.forEach((cell, index) => {
        if (cell.value !== 0) {
          const row = indexToRowIndex(index);
          const col = indexToColIndex(index);
          const box = indexToBoxIndex(index);
          draft.cells.forEach((other, otherIndex) => {
            if (index !== otherIndex) {
              const otherRow = indexToRowIndex(otherIndex);
              const otherCol = indexToColIndex(otherIndex);
              const otherBox = indexToBoxIndex(otherIndex);
              if (row === otherRow || col === otherCol || box === otherBox) {
                other.candidates[cell.value - 1] = false;
              }
            }
          });
        }
      });
    });
    set(newBoard);
  }, [state, set, autoCandidates, savePuzzle]);

  const setCellValue = useCallback((value: number) => {
    if (selectedIndex !== undefined) {
      if (state.cells[selectedIndex].isClue) {
        return;
      }
      const newBoard = produce(state, draft => {
        draft.cells[selectedIndex].value = value;
        draft.cells[selectedIndex].candidates = Array(9).fill(false);
        if (autoCandidates) {
          removeSolvedCellsFromCandidates(draft);
        }
      });
      set(newBoard);
      savePuzzle(newBoard);
    }
  }, [selectedIndex, state, set, savePuzzle, autoCandidates]);

  const toggleCandidate = useCallback((candidate: number) => {
    if (selectedIndex !== undefined) {
      if (state.cells[selectedIndex].isClue) {
        return;
      }
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
    if (selectedIndex !== undefined) {
      if (state.cells[selectedIndex].isClue) {
        return;
      }
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
    const index = selectedIndex === undefined ? 0 : selectedIndex + 1;
    const reordered = state.cells.slice(index).concat(state.cells.slice(0, index));
    const nextIndex = reordered.findIndex(cell => cell.value === 0);
    if (nextIndex !== -1) {
      setSelectedIndex(reordered[nextIndex].index);
    }
  }, [selectedIndex, state]);

  const retreatToPrevCell = useCallback(() => {
    const index = selectedIndex === undefined ? 0 : selectedIndex;
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
      } else if (selectedIndex !== undefined) {
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

  const currentSelection = selectedIndex !== undefined ? state.cells[selectedIndex].candidates : Array(9).fill(false);

  const controlsProps: ControlsProps = {
    candidateMode: isNoteMode,
    canErase: selectedIndex !== undefined && !state.cells[selectedIndex].isClue,
    canUndo: canUndo,
    canRedo: canRedo,
    selectedNumbers: currentSelection,
    onSelectNumber: handleNumberInput,
    onErase: eraseCell,
    onNoteToggle: handleNoteModeToggle,
    onRedo: redo,
    onUndo: undo,
    onToggleAutoCandidates: useCallback(() => {
      setAutoCandidates(!autoCandidates);
      if (autoCandidates) {
        applyAutoCandidates();
      }
    }, [autoCandidates, applyAutoCandidates]),
    autoCandidates: autoCandidates
  };

  return (
    <div className='sudoku-player'>
      <div className='sudoku-stretch'>
        <BoardView {...boardProps} />
      </div>
        <Controls {...controlsProps} />
    </div>
  )
}

export { SudokuPlayer as Sudoku };