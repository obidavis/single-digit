import { useCallback } from 'react';
import { BoardView } from './Player/BoardView';
import {
  AspectRatio,
  Tile,
  Stack,
  SelectableTile,
  ClickableTile,

} from "@carbon/react";
import { useNavigate } from 'react-router-dom';
import { Puzzle } from '../models/SudokuAPI';
import { freshGameState } from '../models/Sudoku';
import { boardToShortString } from '../utils/sudokuUtils';
import "../styles/SudokuCard.scss";

export interface SudokuCardProps {
  puzzle: Puzzle;
};

export const SudokuCard = ({ puzzle }: SudokuCardProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/play?board=${puzzle.clues}`);
  }, [navigate]);

  return (
    <ClickableTile className='sudoku-card' onClick={handleClick} hasRoundedCorners={true} slug>
      <Stack gap={4}>
        <BoardView board={freshGameState(puzzle)} />
        <p>Difficulty: {puzzle.difficulty}</p>
      </Stack>
    </ClickableTile>
  )
}