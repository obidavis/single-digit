
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
import { Board } from '../../models/Sudoku';
import { boardFromString } from '../../utils/sudokuUtils';
import { Link } from 'react-router-dom';
import { SavedPuzzles } from '../../hooks/useSavedPuzzles';
import { SudokuCard } from '../SudokuCard';
import { BoardView } from './BoardView';

interface ActionButtonsProps {
  board: string;
  onRemove: () => void;
};

const ActionButtons = ({ board, onRemove }: ActionButtonsProps) => {
  return (
    <>
      <Button as={Link} to={`/play?board=${board}`} renderIcon={Play} hasIconOnly kind="ghost" iconDescription='Play' />
      <Button onClick={onRemove} renderIcon={TrashCan} hasIconOnly kind="danger" iconDescription='Delete'/>
    </>
  )
};

interface SudokuHistoryProps {
  savedPuzzles: SavedPuzzles;
  onRemove: (key: string) => void;
};

export const History = ({ savedPuzzles, onRemove }: SudokuHistoryProps) => {
  const calculateProgress = (board: Board) => {
    const nonClues = board.cells.filter(cell => !cell.isClue);
    const numNonClues = nonClues.length;
    const filled = nonClues.filter(cell => cell.value !== 0).length;
    return Math.floor(filled / numNonClues * 100);
  };

  const rows = Object.entries(savedPuzzles)
    .map(([key, value]) => {
      return { id: key, board: boardFromString(value.state) };
    })
    .filter(({ board }) => board !== null)
    .map(({ id, board }) => {
      const progress = calculateProgress(board!);
      return {
        id: id,
        board: <BoardView board={board!} />,
        lastPlayed: new Date(savedPuzzles[id].lastPlayed).toLocaleString(),
        progress: <ProgressBar label={`${progress}%`} value={progress} />,
        actions: <ActionButtons board={savedPuzzles[id].state} onRemove={() => onRemove(id)} />
      };
    });

  const headers = [
    {
      key: 'board',
      header: '',
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