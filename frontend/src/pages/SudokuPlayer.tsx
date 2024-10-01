import { useLocation, useNavigate } from "react-router-dom";
import { SudokuPlayer } from "../components/Sudoku/Player";
import { Content, Modal } from "@carbon/react";
import { boardFromString, boardToShortString, validateBoardString } from "../utils/sudokuUtils";
import { Error } from "../components/Error";
import { useSavedPuzzles } from "../hooks/useSavedPuzzles";
import { useCallback, useEffect, useState } from "react";

export const SudokuPlayerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedPuzzles, removePuzzle } = useSavedPuzzles();

  const [boardParam, setBoardParam] = useState<string | null>(null);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const board = searchParams.get('board');
    if (board !== null && validateBoardString(board)) {
      setBoardParam(board);
    } else {
      setBoardParam(null);
    }
  }, [boardParam, location.search]);

  
  const progress = boardParam && savedPuzzles[boardParam];
  
  const handleStartOver = useCallback(() => {
    if (boardParam === null) {
      return;
    }
    const board = boardFromString(boardParam);
    if (board !== null) {
      const shortString = boardToShortString(board);
      removePuzzle(shortString);
      navigate(`?board=${shortString}`, { replace: true });
      setBoardParam(shortString);
    }
  }, [boardParam, navigate, removePuzzle]);

  const handleContinue = useCallback(() => {
    if (boardParam === null) {
      return;
    }
    const boardString = savedPuzzles[boardParam].state;
    navigate(`?board=${boardString}`, { replace: true });
    setBoardParam(boardString);
  }, [boardParam, navigate, savedPuzzles]);

  if (boardParam === null) {
    return <Error message="No board found" />
  }

  const board = boardFromString(boardParam);
  if (board === null) {
    return <Error message="Invalid board" />
  }
  
  return (
    <Content style={{maxWidth: 'none', justifyContent: 'center', padding: "1rem"}}>
      {/* <div className="sudoku-game-root"> */}
        <SudokuPlayer initialState={board} />
      {/* </div> */}
      <Modal 
        open={!!progress}
        modalHeading="Continue?"
        primaryButtonText="Continue"
        secondaryButtonText="Start Over"
        onRequestClose={handleStartOver}
        onRequestSubmit={handleContinue}
      >
        <p>You have a saved game. Would you like to continue where you left off?</p>
      </Modal>
    </Content>
  );
};
