import { useCallback } from 'react';
import { BoardView } from './Player/BoardView';
import {
  AspectRatio,
  Tile,
  Stack,
  SelectableTile,
  ClickableTile,
  Layer,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { useNavigate } from 'react-router-dom';
import { Puzzle } from '../models/SudokuAPI';
import { freshGameState, SudokuCell, SudokuGameState } from '../models/Sudoku';
import { difficultyDescription } from '../utils/sudokuUtils';
import "../styles/SudokuCard.scss";

export interface SudokuCardProps {
  puzzle: Puzzle;
  cells?: SudokuCell[];
  resume?: boolean;
  lastPlayed?: number;
};

const formatDuration = (duration: number) => {
  const seconds = duration / 1000;
  const minutes = seconds / 60;
  const wholeMinutes = Math.floor(minutes);
  const hours = minutes / 60;
  const wholeHours = Math.floor(hours);
  const days = hours / 24;
  const wholeDays = Math.floor(days);
  console.log(wholeDays, wholeHours, wholeMinutes, seconds, duration);
  if (wholeDays > 30) {
    return "> 30 days";
  }
  if (wholeDays > 0) {
    return `${wholeDays} days`;
  }
  if (wholeHours > 0) {
    return `${wholeHours}h`;
  }
  if (wholeMinutes > 0) {
    return `${wholeMinutes}m`;
  }
  return `< 1m`;
}

export const SudokuCard = ({ puzzle, resume, cells, lastPlayed }: SudokuCardProps) => {
  if (!cells) {
    cells = puzzle.clues.split("").map((char, index): SudokuCell => {
      const value = char < "1" || char > "9" ? 0 : parseInt(char);
      return {
        index,
        value,
        candidates: new Array(9).fill(false),
        isClue: value !== 0,
      };
    });
  }
  const navigate = useNavigate();
  const duration = lastPlayed && new Date().getTime() - lastPlayed;
  return (
    <ClickableTile className='sudoku-card' onClick={() => navigate(`/play/${puzzle.clues}`, { state: { resume, state: freshGameState(puzzle) } })}>
      <div>
        <Stack gap={2}>
          <BoardView cells={cells} />
          <p><strong>{difficultyDescription(puzzle.difficulty)}</strong></p>
          {duration && <p>{formatDuration(duration)} ago</p>}
        </Stack>
      </div>
    </ClickableTile>
  );
}



export const SudokuCardList = ({ recentGames }: { recentGames: SudokuGameState[] }) => {
  const navigate = useNavigate();
  const now = new Date().getTime();
  return (
      <div className='sudoku-card-list'>
        {recentGames.map((game, i) => (
            <SudokuCard key={i} puzzle={game.puzzle} cells={game.cells} lastPlayed={game.lastPlayed} resume/>
          )
        )}
      </div>
  );
};
