import { useCallback } from 'react';
import { BoardView } from './Sudoku/BoardView';
import {
  AspectRatio,
  Tile,
  Stack,

} from "@carbon/react";
import { useNavigate } from 'react-router-dom';

const sudokuCardStyle = {
  // display: 'flex' as const,
  // flexDirection: 'column' as const,
  padding: '2rem',
  borderRadius: '0.5rem',
  boxShadow: '0 0 1rem rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
  color: 'black',
  textAlign: 'center' as const,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
};

export const SudokuCard = ({ clues }: { clues: string }) => {
  const navigate = useNavigate();
  const cells = clues.split('').map((c, i) => ({
    index: i,
    value: c === '0' ? 0 : parseInt(c),
    candidates: [],
    isClue: c !== '0',
  }));
  const board = { cells };

  const handleClick = useCallback(() => {
    navigate(`/play?board=${clues}`);
  }, [navigate, clues]);

  return (
    <Tile style={sudokuCardStyle} onClick={handleClick}>
      <Stack gap={4}>
        <BoardView board={board} />
        <p>Easy</p>
      </Stack>
    </Tile>
  )
}