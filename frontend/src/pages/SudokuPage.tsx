import { Button, ButtonSet, ButtonSkeleton, ClickableTile, ExpandableTile, FlexGrid, Grid, InlineLoading, Loading, Tile, TileAboveTheFoldContent, TileBelowTheFoldContent } from "@carbon/react";
import { Link } from "react-router-dom";
import { Library as SudokuLibrary } from "../components/Sudoku/Library";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";
import { InlineLoadingStatuses } from "@carbon/react/lib/components/InlineLoading/InlineLoading";


const SudokuUserHistory = () => {
  return (
    <p>Nothing yet</p>
  );
}

const SudokuGenerator = () => {
    return (
      <div>
        <Button>Generate</Button>
        <Button>Save</Button>
      </div>
    )
  }

const DailyPuzzlesTile = () => {
  const { loading, error, dailyPuzzles } = useDailyPuzzles();
  if (dailyPuzzles === null) {
    return (
      <Tile>
        <h4>Daily Puzzles</h4>
        <br />
        <ButtonSet>
          <ButtonSkeleton />
          <ButtonSkeleton />
          <ButtonSkeleton />
        </ButtonSet>
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


export const SudokuPage = () => {
  return (
    <div>
      <h1>Sudoku</h1>
      <br />
      <p>Pick up where you left off choose from a variety of puzzles from the library, or make your own puzzle to your desired specifications!</p>
      <br />
      <Tile>
        <h4>Recent</h4>
      </Tile>
      <br />
      <DailyPuzzlesTile />
      <br />
      <Tile>
        <h4>Generator</h4>
      </Tile>
    </div>
  );
}
