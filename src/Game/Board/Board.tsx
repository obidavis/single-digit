import { Cell, CellProps, CellData } from './Cell'


function indexToRowIndex(index: number) {
  return Math.floor(index / 9);
}

function indexToColIndex(index: number) {
  return index % 9;
}

function indexToBoxIndex(index: number) {
  return Math.floor((index % 9) / 3) + (3 * Math.floor(Math.floor(index / 9) / 3));
}

type BoxProps = {
  index: number;
  cellProps: CellProps[];
};

function Box(props: BoxProps) {
  return (
    <div className='box three-by-three'>
      {props.cellProps.map((cellProps) => {
        return <Cell key={cellProps.data.index} {...cellProps} />;
      })}
    </div>
  );
}

type BoardProps = {
  cellData: CellData[];
  // selectedIndex?: number;
  // selectedValue?: number;
  selectedCell: CellData | null;
  handleCellClick: (cellData: CellData) => void;
};

const boxIndices = Array.from(Array(81).keys()).map(i => {
  return (i % 3 + (Math.floor(i / 9) * 3) % 9) + (9 * (Math.floor((i % 9) / 3) + Math.floor(i / 27) * 3));
})

function Board(props: BoardProps) {

const selectedRow = props.selectedCell !== null 
  ? indexToRowIndex(props.selectedCell.index)
  : -1;

const selectedCol = props.selectedCell !== null
  ? indexToColIndex(props.selectedCell.index)
  : -1;

const selectedBox = props.selectedCell !== null 
  ? indexToBoxIndex(props.selectedCell.index)
  : -1;

const cellProps = props.cellData.map((data, index) => {
  
    // highlighting logic happens here
    const isHighlightedByPosition =
      (selectedRow === indexToRowIndex(data.index)) ||
      (selectedCol === indexToColIndex(data.index)) ||
      (selectedBox === indexToBoxIndex(data.index));

    const isHighlightedByValue =
      (data.value !== 0) &&
      (data.value === props.selectedCell?.value);

    const isSelected =
      (data === props.selectedCell);

    return {
      data: data,
      index: index,
      isSelected: isSelected,
      isHighlightedByValue: isHighlightedByValue,
      isHighlightedByPosition: isHighlightedByPosition,
      onClick: props.handleCellClick
    };
  });

  // Reorder the cells to go to the right indices if we fill
  // by boxes first (as in here) instead of rows (as in standard board strings).
  // e.g. for Box 1:
  // + ----- +    + -------- +
  // | 0 1 2 |    | 0  1  2  |
  // | 3 4 5 | => | 9  10 11 |
  // | 6 7 8 |    | 18 19 20 |
  // + ----- +    + -------- +
  // TODO: ugly calc
  const reorderedCellProps = cellProps.map((_, index, cellProps) => {
    // column and row index from index within box
    return cellProps[boxIndices[index]];
  });

  // from 0-8, render a box with the appropriate
  // slice of the reordered cell props
  return (
    <div className='board three-by-three'>
      {Array.from(Array(9).keys()).map((index) => {
        const begin = index * 9;
        const end = begin + 9;
        return (
          <Box 
            key={index} 
            index={index} 
            cellProps={reorderedCellProps.slice(begin, end)} />
          );
      })}
    </div>
  );
}

export { Board };
export type { BoardProps };
