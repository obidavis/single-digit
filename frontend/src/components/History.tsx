
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  ProgressBar,
} from '@carbon/react';
import { Play, TrashCan } from '@carbon/icons-react';
import { SudokuGameState } from '../models/Sudoku';
import { boardFromString, boardToShortString, boardToLongString } from '../utils/sudokuUtils';
import { Link } from 'react-router-dom';
import { SavedPuzzles } from '../hooks/useSavedPuzzles';
import { SudokuCard } from './GameCard';
import { BoardView } from './Player/BoardView';

interface ActionButtonsProps {
  boardString: string;
  onRemove: () => void;
};

const ActionButtons = ({ boardString: board, onRemove }: ActionButtonsProps) => {
  return (
    <>
      <Button 
        as={Link} 
        to={{
          pathname: `/play/${board}`,
        }} 
        state={{ resume: true }}
        renderIcon={Play} hasIconOnly 
        kind="primary" 
        iconDescription='Resume' 
        />
      <Button onClick={onRemove} renderIcon={TrashCan} hasIconOnly kind="danger" iconDescription='Delete'/>
    </>
  )
};

interface SudokuHistoryProps {
  savedPuzzles: SavedPuzzles;
  onRemove: (key: string) => void;
};

export const History = ({ savedPuzzles, onRemove }: SudokuHistoryProps) => {
  const calculateProgress = (board: SudokuGameState) => {
    const nonClues = board.cells.filter(cell => !cell.isClue);
    const numNonClues = nonClues.length;
    const filled = nonClues.filter(cell => cell.value !== 0).length;
    return Math.floor(filled / numNonClues * 100);
  };

  const headers = [
    {
      key: 'board',
      header: '',
    },
    {
      key: 'difficulty',
      header: 'Difficulty'
    },
    {
      key: 'lastPlayed',
      header: 'Last Played'
    },
    {
      key: 'progress',
      header: 'Progress'
    },
    {
      key: 'actions',
      header: 'Actions'
    }
  ];

  const rows = Object.entries(savedPuzzles)
    .map(([id, state]) => {
      const progress = calculateProgress(state);
      return {
        id: id,
        board: <BoardView cells={state.cells} />,
        lastPlayed: new Date(savedPuzzles[id].lastPlayed).toLocaleString(),
        progress: <ProgressBar label={`${progress}%`} value={progress} />,
        difficulty: state.puzzle.difficulty === null ? 'Unknown' : state.puzzle.difficulty,
        actions: <ActionButtons boardString={state.puzzle.clues} onRemove={() => onRemove(id)} />
      };
    });


  if (rows.length === 0) {
    return <p>No saved games</p>;
  }

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </>
  )
};