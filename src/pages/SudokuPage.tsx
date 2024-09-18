import { Button, ClickableTile, ExpandableTile, FlexGrid, Grid, Tile, TileAboveTheFoldContent, TileBelowTheFoldContent } from "@carbon/react";
import { Link } from "react-router-dom";
import { Library as SudokuLibrary } from "../components/Sudoku/Library";


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

export const SudokuPage = () => {
  const easy = "000800500006109000150070060000090007020000910500004000080900072000240800007003000";
  const moderate = "070030000030109004009402000008000200004008905091700600000905400900200030000080050";
  const tough = "000006001030000004000472060300001200704060900001700003080915000900000030200080000";
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
      <Tile>
        <h4>Daily Puzzles</h4>
        <Link to={`/sudoku/play?board=${easy}`}>Easy</Link>
        <Link to={`/sudoku/play?board=${moderate}`}>Moderate</Link>
        <Link to={`/sudoku/play?board=${tough}`}>Tough</Link>
      </Tile>
      <br />
      <Tile>
        <h4>Generator</h4>
      </Tile>
    </div>
  );
}
