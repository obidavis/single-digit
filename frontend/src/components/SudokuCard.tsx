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
import { difficultyDescription } from '../utils/sudokuUtils';
import "../styles/SudokuCard.scss";

export interface SudokuCardProps {
  puzzle: Puzzle;
};

export const SudokuCard = ({ puzzle }: SudokuCardProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/play/${puzzle.clues}`);
  }, [navigate]);

  const difficulty = puzzle.difficulty === null ? 'Unknown' : difficultyDescription(puzzle.difficulty);
  const cells = puzzle.clues.split('').map((value, index) => {
    return {
      index,
      value: value === '0' ? 0 : parseInt(value),
      candidates: new Array(9).fill(false),
      isClue: value !== '0',
    };
  });
  return (
    <ClickableTile className='sudoku-card' onClick={handleClick} >
      <Stack gap={4}>
        <BoardView cells={cells} />
        <p>{difficulty}</p>
      </Stack>
    </ClickableTile>
  )
}