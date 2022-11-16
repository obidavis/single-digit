type CandidateViewProps = {
  candidates: boolean[];
}

function CandidateView(props: CandidateViewProps) {
  return (
    <div className='candidates-view three-by-three'>
      {props.candidates.map((candidate, index) => {
        return (
          <div key={index} className='candidate'>
            {candidate ? index + 1 : ''}
          </div>
        );
      })}
    </div>
  )
}

type CellData = {
  index: number;
  value: number;
  candidates: boolean[];
  isUserSubmitted: boolean;
};

type CellProps = {
  data: CellData;
  isSelected: boolean;
  isHighlightedByPosition: boolean;
  isHighlightedByValue: boolean;
  onClick: (cellData: CellData) => void;
};

function Cell(props: CellProps) {
  return (
    <div 
      className={
        'cell' 
        + (props.isSelected              ? ' selected' : '')
        + (props.isHighlightedByValue    ? ' value-highlighted': '')
        + (props.isHighlightedByPosition ? ' position-highlighted' : '')
        + (props.data.isUserSubmitted    ? ' user-submitted' : ' pre-given')}
      onClick={() => props.onClick(props.data)}
      >
        {props.data.value
          ? <div className='number'>{props.data.value}</div>
          : <CandidateView candidates={props.data.candidates} />}
        {props.isSelected
          ? <div className='selection-square'/> : <></>}
    </div>
  );
}

export { Cell };
export type { CellProps, CellData };