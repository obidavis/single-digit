import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SudokuPlayer } from "../components/Sudoku/Player";
import { Content, Modal } from "@carbon/react";
import { boardFromString, boardToShortString, validateBoardString, boardToLongString } from "../utils/sudokuUtils";
import { Error } from "../components/Error";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { useCallback, useEffect, useState, useMemo } from "react";
import defaultPuzzles from "../data/defaultPuzzles.json";
import { PuzzleSet } from "../models/SudokuAPI";

const { puzzles } = defaultPuzzles as PuzzleSet;

export const SudokuPlayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boardParam = useMemo(() => searchParams.has('board') ? searchParams.get('board')! : puzzles[0].clues, []);
  const savedPuzzle = useSavedPuzzlesStore.getState().savedPuzzles[boardParam];
  const removePuzzle = useSavedPuzzlesStore(useCallback((state) => state.removePuzzle, []));
  const hasSavedProgress = savedPuzzle !== undefined;
  
  const location = useLocation();
  const resume = location.state?.resume;

  const board = resume && hasSavedProgress ? savedPuzzle.board : boardFromString(boardParam);
  console.log('resume', resume, 'hasSavedProgress', hasSavedProgress, 'board', board);

  const handleStartOver = useCallback(() => {
    const board = boardFromString(boardParam)
    if (board !== null) {
      const shortString = boardToShortString(board);
      removePuzzle(shortString);
    }
  }, [boardParam, removePuzzle]);

  const handleContinue = useCallback(() => {
    if (boardParam === null) {
      return;
    }
    navigate(`?board=${boardParam}`, { replace: true, state: { resume: true } });
  }, [boardParam, navigate]);

  return (
    <Content style={{maxWidth: 'none', justifyContent: 'center', padding: "1rem"}}>
      <SudokuPlayer initialState={board!} />
      <Modal 
        open={resume === undefined && hasSavedProgress}
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
