import { useSavedPuzzlesStore } from '../hooks/useSavedPuzzles';
import { History } from '../components/History';
import { Content } from '@carbon/react';

export const SudokuHistoryPage = () => {
  const { savedGames: savedPuzzles, removePuzzle } = useSavedPuzzlesStore();
  return (
    <Content>
      <History savedPuzzles={savedPuzzles} onRemove={removePuzzle}/>
    </Content>
  );
}
