import { Button, ButtonSet, ButtonSkeleton, Tile } from "@carbon/react";
import { Link } from "react-router-dom";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";
import { useSavedPuzzles } from "../hooks/useSavedPuzzles";
import { History } from "../components/Sudoku/History";

const RecentTile = () => {
  const { savedPuzzles, removePuzzle } = useSavedPuzzles();
  // Only show the most recent 5 puzzles
  const recentPuzzles = Object.entries(savedPuzzles).sort((a, b) => {
    return b[1].lastPlayed - a[1].lastPlayed;
  }).slice(0, 5);
  return (
    <Tile>
      <h4>Recent</h4>
      <br />
      <History savedPuzzles={Object.fromEntries(recentPuzzles)} onRemove={removePuzzle}/>
    </Tile>
  );
}

const DailyPuzzlesTile = () => {
  const { dailyPuzzles } = useDailyPuzzles();
  if (dailyPuzzles === null) {
    return (
      <Tile>
        <h4>Daily Puzzles</h4>
        <br />
        <>
          <ButtonSkeleton />
          <ButtonSkeleton />
          <ButtonSkeleton />
        </>
      </Tile>
    );
  }

  return (
    <Tile>
      <h4>Daily Puzzles</h4>
      <br />
      <ButtonSet>
        <Button as={Link} to={`/sudoku/play?board=${dailyPuzzles.easy.clues}`}>Easy</Button>
        <Button as={Link} to={`/sudoku/play?board=${dailyPuzzles.moderate.clues}`}>Moderate</Button>
        <Button as={Link} to={`/sudoku/play?board=${dailyPuzzles.tough.clues}`}>Tough</Button>
      </ButtonSet>
    </Tile>
  )
}

const GeneratorTile = () => {
  return (
    <Tile>
      <h4>Generator</h4>
      <br />
      <p>Unimplemented :(</p>
    </Tile>
  );
}

export const SudokuPage = () => {
  return (
    <div>
      <h1>Sudoku</h1>
      <br />
      <p>Pick up where you left off choose from a variety of puzzles from the library, or make your own puzzle to your desired specifications!</p>
      <br />
      <RecentTile />
      <br />
      <DailyPuzzlesTile />
      <br />
      <GeneratorTile />
    </div>
  );
}
