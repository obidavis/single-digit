import { Button, ButtonSet, ButtonSkeleton, Tile } from "@carbon/react";
import { Link } from "react-router-dom";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";


const DailyPuzzlesTile = () => {
  const { dailyPuzzles } = useDailyPuzzles();
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
