import { useState } from 'react'
import { Board, BoardProps } from './Board/Board'
import type { CellData } from './Board/Cell'
import { Controls, ControlsProps } from './Controls/Controls';

type SudokuInit = string | CellData[];

type SudokuProps = {
  init: SudokuInit;
};

function Sudoku(props: SudokuProps) {

  // Generate fresh state from board string
  // or use previous state from history
  // depending on what is provided
  const [history, setHistory] = useState<CellData[][]>(
    typeof (props.init) == 'string'
      ? [Array.from(props.init).map((value, index) => {
        return {
          index: index,
          value: Number.parseInt(value),
          candidates: Array(9).fill(false),
          isUserSubmitted: !(Number.parseInt(value) > 0)
        }
      })]
      : [props.init]
  );
  
  const [future, setFuture] = useState<CellData[][]>(Array(0));

  // create live copy of the current state
  // that all handlers etc. work from
  let [cellData] = history.slice(-1);
  
  // Keep track of which cell is selected for highlighting etc.
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

  // note mode toggle state
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);

  // callback for number selector button when in note mode
  const handleCandidateSubmit = (value: number) => {
    if (!selectedCell)
      return;
    // don't do anything if the cell is solved
    if (selectedCell.value > 0)
      return;
    
    

    let newCellData: CellData[] = JSON.parse(JSON.stringify(cellData));

    ;

    if (value > -1)
      // flip the value
      newCellData[selectedCell.index].candidates[value] = 
      !newCellData[selectedCell.index].candidates[value];
    else
      // sentinel value for clear all
      newCellData[selectedCell.index].candidates = Array(9).fill(false);

    setHistory(history.concat([newCellData]));
    setFuture([]);
    setSelectedCell(newCellData[selectedCell.index]);
  };

  // callback for number selector button when in value mode
  const handleValueSubmit = (value: number) => {
    if (!selectedCell)
      return;

    // don't update pre-given cells
    if (!selectedCell.isUserSubmitted)
      return;

    // don't clutter history with dupes
    if (value === selectedCell.value)
      return;

    // deep copy to add to history
    let newCellData = JSON.parse(JSON.stringify(cellData));
    // let newSelectedCell = newCellData[selectedCell.index];
    // set cell state
    Object.assign(newCellData[selectedCell.index],
    {
      value: value,
      candidates: Array(9).fill(false),
      isUserSubmitted: true
    });

    // update highlighting
    // TODO: isn't the whole point that this happens automatically?
    // setCurrentSelection(Object.assign({}, currentSelection, {value: value}));

    setHistory(history.concat([newCellData]));
    setFuture([]);
    setSelectedCell(newCellData[selectedCell.index]);
  }

  // Props to pass to board
  const boardProps: BoardProps =
  {
    cellData: cellData,
    selectedCell: selectedCell,
    handleCellClick: (cellData: CellData) => setSelectedCell(cellData),
  };

  const handleErase = () => {
    handleValueSubmit(0);
    handleCandidateSubmit(-1); 
  };

  const handleUndo = () => {
    if (history.length < 2)
      return;

    if (selectedCell !== null)
    {
      const [previousState] = history.slice(-2);
      const previousCell = previousState[selectedCell.index];
      setSelectedCell(previousCell);  
    }

    setFuture(future.concat([cellData]));
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (!future) 
      return;

    if (selectedCell !== null)
    {
      const [nextState] = future.slice(-1);
      const nextCell = nextState[selectedCell.index];
      setSelectedCell(nextCell);
    }
    setHistory(history.concat(future.slice(-1)));
    setFuture(future.slice(0, -1));
  };

  const handleNoteToggle = () => {
    setIsNoteMode(!isNoteMode);
  };

  const controlsProps: ControlsProps = {
    isNoteMode: isNoteMode,
    canErase: 
      (selectedCell !== null) && 
      (selectedCell.value > 0 || selectedCell.candidates.findIndex(value => value) > -1),
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
        <Board    {...boardProps} />
      </div>
      <div className='controls-container'>
        <Controls {...controlsProps} />
      </div>
    </div>
  )
}

export type { SudokuInit };
export { Sudoku };