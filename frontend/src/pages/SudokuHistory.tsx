import { useSavedPuzzles } from '../hooks/useSavedPuzzles';
import { History } from '../components/Sudoku/History';
import { Content } from '@carbon/react';

export const SudokuHistoryPage = () => {
  const { savedPuzzles, removePuzzle } = useSavedPuzzles();
  return (
    <Content>
      <History savedPuzzles={savedPuzzles} onRemove={removePuzzle}/>
    </Content>
  );
}
