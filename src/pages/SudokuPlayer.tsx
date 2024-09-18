import { useLocation } from "react-router-dom";
import { SudokuPlayer } from "../components/Sudoku/Player";
import { Board, boardFromString } from "../models/Board";

export const SudokuPlayerPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const board = searchParams.get("board");

  if (board !== null) {
    return <SudokuPlayer initialState={boardFromString(board)} />;
  } else {
    return <SudokuPlayer initialState={boardFromString("000006001030000004000472060300001200704060900001700003080915000900000030200080000")} />;
  }
}
