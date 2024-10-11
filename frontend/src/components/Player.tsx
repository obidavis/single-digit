import { useEffect, useState, useRef, useContext, useMemo } from 'react'
import { BoardView, BoardViewProps } from './Player/BoardView'
import { SudokuCell, SudokuGameState } from '../models/Sudoku';
import { Controls, ControlsProps } from './Player/Controls';
import { useNavigate } from 'react-router-dom';
import { produce } from 'immer';
import { useHistoryState } from '@uidotdev/usehooks';
import { indexToBoxIndex, indexToRowAndCol, indexToRowIndex, rowAndColToIndex, indexToColIndex, removeSolvedCellsFromCandidates } from '../utils/sudokuUtils';
import { useSavedPuzzlesStore } from '../hooks/useSavedPuzzles';
import "../styles/Player.scss";
import { Loading, Modal } from '@carbon/react';


export interface SudokuPlayerProps {
  initialState?: SudokuGameState;
}

enum CompletionState {
  InProgress,
  Completed,
  Error
};

export const SudokuPlayer = ({ initialState }: SudokuPlayerProps) => {
  const { state, undo, redo, canRedo, canUndo, set, clear } = useHistoryState<SudokuGameState>(initialState);
  const savePuzzle = useSavedPuzzlesStore(state => state.savePuzzle);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [autoCandidates, setAutoCandidates] = useState(false);
  const [completionState, setCompletionState] = useState(CompletionState.InProgress);
  const navigate = useNavigate();
  const applyAutoCandidates = () => {
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
  };

  const updateCell = (updateFn: (cell: SudokuCell) => SudokuCell) => {
    if (selectedIndex !== undefined) {
      const newBoard = produce(state, draft => {
        draft.cells[selectedIndex] = updateFn(draft.cells[selectedIndex]);
        
        draft.lastPlayed = new Date().getTime();

        if (draft.cells.every(cell => cell.value !== 0)) {
          const solved = draft.cells.map(cell => cell.value).join('');
          if (solved === draft.puzzle.solution) {
            draft.solved = true;
            setCompletionState(CompletionState.Completed);
          } else {
            setCompletionState(CompletionState.Error);
          }
        }
      });
      set(newBoard);
      savePuzzle(newBoard);
    }
  };

  const setCellValue = (value: number) => 
    updateCell(cell => (
      {
        ...cell,
        value,
        candidates: Array(9).fill(false)
      }
    )
  );


  const toggleCandidate = (candidate: number) => 
    updateCell(cell => (
      {
        ...cell,
        value: 0,
        candidates: cell.candidates.map((c, i) => i === candidate - 1 ? !c : c)
      }
    )
  );


  const handleNumberInput = (value: number) => {
    if (isNoteMode) {
      toggleCandidate(value);
    }
    else {
      setCellValue(value);
    }
  };

  const eraseCell = () => 
    updateCell(cell => (
      {
        ...cell,
        value: 0,
        candidates: Array(9).fill(false)
      }
    )
  );

  const handleNoteModeToggle = () => {
    setIsNoteMode(!isNoteMode);
  };

  const advanceToNextCell = () => { 
    const index = selectedIndex === undefined ? 0 : selectedIndex + 1;
    const reordered = state.cells.slice(index).concat(state.cells.slice(0, index));
    const nextIndex = reordered.findIndex(cell => cell.value === 0);
    if (nextIndex !== -1) {
      setSelectedIndex(reordered[nextIndex].index);
    }
  };

  const retreatToPrevCell = () => {
    const index = selectedIndex === undefined ? 0 : selectedIndex;
    const reordered = state.cells.slice(index).concat(state.cells.slice(0, index));
    const prevIndex = reordered.slice().reverse().findIndex(cell => cell.value === 0);
    if (prevIndex !== -1) {
      setSelectedIndex(reordered[reordered.length - prevIndex - 1].index);
    }
  };

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
    cells: state.cells || Array(81).fill({ value: 0, candidates: Array(9).fill(false), isClue: false }),
    selectedIndex: selectedIndex,
    onCellClick: (cell: SudokuCell) => setSelectedIndex(cell.index)
  };

  const currentSelection = selectedIndex !== undefined ? state.cells[selectedIndex].candidates : Array(9).fill(false);

  const controlsProps: ControlsProps = {
    candidateMode: isNoteMode,
    canErase: selectedIndex !== undefined && !state.cells[selectedIndex].isClue && (state.cells[selectedIndex].value !== 0 || state.cells[selectedIndex].candidates.some(c => c)),
    canUndo: canUndo,
    canRedo: canRedo,
    selectedNumbers: currentSelection,
    onSelectNumber: handleNumberInput,
    onErase: eraseCell,
    onNoteToggle: handleNoteModeToggle,
    onRedo: redo,
    onUndo: undo,
    onToggleAutoCandidates: () => {
      setAutoCandidates(!autoCandidates);
    },
    autoCandidates: autoCandidates
  };

  return (
    <>
      <Loading active={!initialState} />
      <div className='sudoku-player'>
        <div className='sudoku-stretch'>
          <BoardView {...boardProps} />
        </div>
          <Controls {...controlsProps} />
      </div>
      <Modal  
        open={completionState === CompletionState.Completed}
        primaryButtonText="Return to Home"
        secondaryButtonText="Admire Your Work"
        modalHeading="Congratulations!"
        onRequestClose={() => setCompletionState(CompletionState.InProgress)}
        onRequestSubmit={() => navigate('/')}
        size='sm'
      >
        <p>You have completed the puzzle!</p>
      </Modal>
      <Modal passiveModal
        open={completionState === CompletionState.Error}
        modalHeading="Almost..."
        onRequestClose={() => setCompletionState(CompletionState.InProgress)}
        size='sm'
      >
        <p>There seems to be an error in your solution. Keep trying!</p>
      </Modal>


    </>
  )
}
export { SudokuPlayer as Sudoku };