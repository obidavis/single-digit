import { SudokuCell, } from '../../models/Sudoku';

interface CandidateViewProps {
  candidates: boolean[];
}

function CandidateView(props: CandidateViewProps) {
  return (
    <div className='candidates three-by-three'>
      {props.candidates.map((candidate, index) => {
        return (
          <div key={index} className='number'>
            {candidate ? index + 1 : ''}
          </div>
        );
      })}
    </div>
  )
}

export interface CellViewProps {
  cell: SudokuCell;
  isSelected?: boolean;
  isHighlightedByValue?: boolean;
  isHighlightedByPosition?: boolean;
  onClick: (cell: SudokuCell) => void;
}

export const CellView = ({ cell, isSelected, isHighlightedByPosition, isHighlightedByValue, onClick }: CellViewProps) => (
  <div 
    className={
      'cell' 
      + (isSelected              ? ' selected' : '')
      + (isHighlightedByValue    ? ' value-highlighted': '')
      + (isHighlightedByPosition ? ' position-highlighted' : '')
      + (cell.isClue             ? ' pre-given' : ' user-submitted')}
    onClick={() => onClick(cell)}
    >
      {cell.value > 0
        ? <div className='number'>{cell.value}</div>
        : <CandidateView candidates={cell.candidates} />}
      {isSelected
        ? <div className='selection-square'/> : <></>}
  </div>
)

