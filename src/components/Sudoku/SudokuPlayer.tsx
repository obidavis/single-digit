import { useCallback, useEffect, useState } from 'react'
import { BoardView, BoardViewProps } from './BoardView'
import { Cell, Board, boardFromString } from '../../models';
import { Controls, ControlsProps } from './SudokuControls';

type SudokuInit = string | Cell[];

type SudokuProps = {
  init: SudokuInit;
};

function Sudoku(props: SudokuProps) {
  // Generate fresh state from board string
  // or use previous state from history
  // depending on what is provided
  const [history, setHistory] = useState<Board[]>(
    typeof (props.init) == 'string'
      ? [boardFromString(props.init)]
      : [new Board(props.init)]
  );

  const [future, setFuture] = useState<Board[]>(Array(0));

  // create live copy of the current state
  // that all handlers etc. work from
  const [board] = history.slice(-1);

  // Keep track of which cell is selected for highlighting etc.
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  // note mode toggle state
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);

  // callback for number selector button when in note mode
  const handleCandidateSubmit = useCallback((value: number) => {
    if (!selectedCell)
      return;
    // don't do anything if the cell is solved
    if (selectedCell.value > 0)
      return;

    // deep copy
    const newBoard = board.clone();

    if (value > -1) {
      newBoard.cells[selectedCell.index].toggleCandidate(value);
    }
    else {
      // sentinel value for clear all
      newBoard.cells[selectedCell.index].candidates = Array(9).fill(false);
    }

    setHistory(history.concat([newBoard]));
    setFuture([]);
    setSelectedCell(newBoard.cells[selectedCell.index]);
  }, [board, history, selectedCell]);

  // callback for number selection when in value mode
  const handleValueSubmit = useCallback((value: number) => {
    if (!selectedCell)
      return;

    // don't update pre-given cells
    if (selectedCell.isClue)
      return;

    // don't clutter history with dupes
    if (value === selectedCell.value)
      return;

    // deep copy to add to history
    const newCellData = board.clone();
    // let newSelectedCell = newCellData[selectedCell.index];
    // set cell state
    console.log(newCellData);
    newCellData.cells[selectedCell.index].solve(value);

    setHistory(history.concat([newCellData]));
    setFuture([]);
    setSelectedCell(newCellData.cells[selectedCell.index]);
  }, [board, history, selectedCell]);
  const handleErase = useCallback(() => {
    handleValueSubmit(0);
    handleCandidateSubmit(-1);
  }, [handleCandidateSubmit, handleValueSubmit]);

  const handleUndo = useCallback(() => {
    if (history.length < 2)
      return;

    if (selectedCell !== null) {
      const [previousState] = history.slice(-2);
      const previousCell = previousState.cells[selectedCell.index];
      setSelectedCell(previousCell);
    }

    setFuture(future.concat([board]));
    setHistory(history.slice(0, -1));
  }, [board, future, history, selectedCell]);

  const handleRedo = useCallback(() => {
    if (!future)
      return;

    if (selectedCell !== null) {
      const [nextState] = future.slice(-1);
      const nextCell = nextState.cells[selectedCell.index];
      setSelectedCell(nextCell);
    }
    setHistory(history.concat(future.slice(-1)));
    setFuture(future.slice(0, -1));
  }, [history, future, selectedCell]);

  const handleNoteToggle = useCallback(() => {
    setIsNoteMode(!isNoteMode);
  }, [isNoteMode]);


  // named event handler to allow binding and destruction to document
  const handleKeyDown = useCallback((ev: KeyboardEvent) => {
    const handleTab = () => {
      console.log(ev);
      ev.preventDefault();
      let nextIndex = -1;
      const openCells = board.cells.filter(cell => cell.value === 0);
      const thisIndex = selectedCell ? selectedCell.index : -1;
      const nextCell = openCells.find(cell => cell.index > thisIndex);
      const prevCell = openCells.slice(0).reverse().find(cell => cell.index < thisIndex);
      if (ev.shiftKey) {
        if (!prevCell) {
          setSelectedCell(openCells[openCells.length - 1]);
        } else {
          setSelectedCell(prevCell);
        }
      } else {
        if (!nextCell) {
          setSelectedCell(openCells[0]);
        } else {
          setSelectedCell(nextCell);
        }
      }
    };

    // general arrow case
    type direction = -1 | 0 | 1;
    const handleArrow = (x: direction, y: direction) => {
      if (selectedCell) {
        const col = selectedCell.index % 9;
        const row = Math.floor(selectedCell.index / 9)
        const newCol = ((col + x) + 9) % 9;
        const newRow = ((row + y) + 9) % 9;
        const newIndex = newCol + (newRow * 9);
        setSelectedCell(board.cells[newIndex]);
      }
    }

    // main switch
    // TODO object would allow user key binding
    switch (ev.key) {
      // arrow keys
      case "ArrowUp":
        handleArrow(0, -1);
        break;
      case "ArrowDown":
        handleArrow(0, 1);
        break;
      case "ArrowLeft":
        handleArrow(-1, 0);
        break;
      case "ArrowRight":
        handleArrow(1, 0);
        break;
      case "Tab":
        handleTab();
        break;
      case "Escape":
        setSelectedCell(null);
        break;
      // number keys
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (isNoteMode) {
          handleCandidateSubmit(Number(ev.key));
        }
        else {
          handleValueSubmit(Number(ev.key));
        }
        break;
      // other controls
      case "z":
        if (ev.ctrlKey) {
          handleUndo();
        }
        break;
      case "Z":
      case "r":
      case "y":
        if (ev.ctrlKey) {
          handleRedo();
        }
        break;
      case "Backspace":
      case "Delete":
      case "0":
        handleErase();
        break;
      case "Alt":
      case "n":
        handleNoteToggle();
        break;
      default:
        console.log(ev);
        break;
    }
  }, [board, handleCandidateSubmit, handleErase, handleNoteToggle, handleRedo, handleUndo, handleValueSubmit, isNoteMode, selectedCell]);
  // keypress handling - basically just calling the same
  // handlers as we pass to the buttons. Pretty random so far
  useEffect(() => {
    // bind
    document.addEventListener("keydown", handleKeyDown, true);
    // destruct
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);


  // Props to pass to board
  const boardProps: BoardViewProps = {
    board: board,
    selectedCell: selectedCell,
    onClick: (cellData: Cell) => setSelectedCell(cellData)
  };


  const controlsProps: ControlsProps = {
    isNoteMode: isNoteMode,
    canErase:
      (selectedCell !== null) &&
      (!selectedCell.isClue) &&
      (selectedCell.value > 0 ||
        selectedCell.candidates.findIndex(value => value) > -1),
    canUndo: history.length > 1,
    canRedo: future.length > 0,
    currentSelection: // candidates if we have a valid, unsolved selected cell, otherwise blank
      (selectedCell !== null && selectedCell.value === 0)
        ? selectedCell.candidates
        : Array(9).fill(false),
    onSelectNumber: // choose handler based on note toggle
      isNoteMode
        ? handleCandidateSubmit
        : (value: number) => handleValueSubmit(value + 1),
    onErase: handleErase,
    onNoteToggle: handleNoteToggle,
    onRedo: handleRedo,
    onUndo: handleUndo
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

export type { SudokuInit };
export { Sudoku };