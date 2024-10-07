import { SudokuCell, SudokuGameState } from '../../models/Sudoku';
import { CellView, CellViewProps } from './CellView';
import { indexToBoxIndex, indexToColIndex, indexToRowIndex } from '../../utils/sudokuUtils';
import "../../styles/Player.scss";

const boxIndices = Array.from(Array(81).keys()).map((i) => {
  return (
    (i % 3) +
    ((Math.floor(i / 9) * 3) % 9) +
    9 * (Math.floor((i % 9) / 3) + Math.floor(i / 27) * 3)
  );
});

export interface BoardViewProps {
  board: SudokuGameState;
  selectedIndex?: number;
  onCellClick?: (cell: SudokuCell) => void;
}

export const BoardView = ({ board, selectedIndex, onCellClick: onClick = () => {}}: BoardViewProps) => {
  const selectedRow = selectedIndex && indexToRowIndex(selectedIndex);
  const selectedCol = selectedIndex && indexToColIndex(selectedIndex);
  const selectedBox = selectedIndex && indexToBoxIndex(selectedIndex);

  const cellProps = board.cells.map((cell, index): CellViewProps => {
    const isHighlightedByPosition =
      selectedRow === indexToRowIndex(index) ||
      selectedCol === indexToColIndex(index) ||
      selectedBox === indexToBoxIndex(index);
    const isHighlightedByValue = selectedIndex !== undefined && (cell.value > 0) && cell.value === board.cells[selectedIndex].value;
    const isSelected = selectedIndex === index;
    
    return {
      cell: cell,
      isSelected: isSelected,
      isHighlightedByValue: isHighlightedByValue,
      isHighlightedByPosition: isHighlightedByPosition,
      onClick: onClick,
    };
  }).map((cell, index, array): CellViewProps => (
    // Reorder the cells to go to the right indices if we fill
    // by boxes first (as in here) instead of rows (as in standard board strings).
    // e.g. for Box 1:
    // + ----- +    + -------- +
    // | 0 1 2 |    | 0  1  2  |
    // | 3 4 5 | => | 9  10 11 |
    // | 6 7 8 |    | 18 19 20 |
    // + ----- +    + -------- +
    array[boxIndices[index]]
  ));
  
  // from 0-8, render a box with the appropriate
  // slice of the reordered cell props
  return (
    // <div className='board-container'>
      <div className="board three-by-three">
        {Array.from(Array(9).keys()).map((boxIndex) => {
          const begin = boxIndex * 9;
          const end = begin + 9;
          return (
            <div key={boxIndex} className="box three-by-three">
              {cellProps.slice(begin, end).map((props, cellIndex) => {
                return <CellView key={cellIndex} {...props} />;
              })}
            </div>
          );
        })}
      </div>
    // </div>
  );
}