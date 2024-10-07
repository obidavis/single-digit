import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SudokuPlayer } from "../components/Player";
import { Content, Modal } from "@carbon/react";
import { boardFromString, boardToShortString, validateBoardString, boardToLongString } from "../utils/sudokuUtils";
import { Error } from "../components/Error";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { useCallback, useEffect, useState, useMemo } from "react";
import defaultPuzzles from "../data/defaultPuzzles.json";
import { PuzzleSet } from "../models/SudokuAPI";
import { freshGameState } from "../models/Sudoku";

const { puzzles } = defaultPuzzles as PuzzleSet;

export const SudokuPlayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boardParam = useMemo(() => searchParams.has('board') ? searchParams.get('board')! : puzzles[0].clues, []);
  const savedPuzzle = useSavedPuzzlesStore.getState().savedGames[boardParam];
  const hasSavedProgress = savedPuzzle !== undefined;
  const removePuzzle = useSavedPuzzlesStore(useCallback((state) => state.removePuzzle, []));
  
  const location = useLocation();
  const resume = location.state?.resume;

  const gameState = resume && hasSavedProgress ? savedPuzzle : freshGameState({ clues: boardParam, solution: '', difficulty: 0 });

  const handleStartOver = useCallback(() => {
    removePuzzle(boardParam);
    navigate(`?board=${boardParam}`, { replace: true });
  }, [boardParam, removePuzzle]);

  const handleContinue = useCallback(() => {
    if (boardParam === null) {
      return;
    }
    navigate(`?board=${boardParam}`, { replace: true, state: { resume: true } });
  }, [boardParam, navigate]);

  return (
    <Content style={{maxWidth: 'none', justifyContent: 'center', padding: "1rem"}}>
      <SudokuPlayer initialState={gameState!} />
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
