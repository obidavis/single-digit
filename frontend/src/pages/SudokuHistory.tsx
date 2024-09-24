import { useSavedPuzzles } from '../hooks/useSavedPuzzles';
import { History } from '../components/Sudoku/History';

export const SudokuHistoryPage = () => {
  const { savedPuzzles, removePuzzle } = useSavedPuzzles();
  return (
    <History savedPuzzles={savedPuzzles} onRemove={removePuzzle}/>
  );
}
