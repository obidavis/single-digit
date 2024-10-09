import { useSavedPuzzlesStore } from '../hooks/useSavedPuzzles';
import { History } from '../components/History';
import { Content } from '@carbon/react';

export const HistoryPage = () => {
  const { savedGames: savedPuzzles, removePuzzle } = useSavedPuzzlesStore();
  return (
      <History savedPuzzles={savedPuzzles} onRemove={removePuzzle}/>
  );
}
