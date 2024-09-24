import { useLocation, useNavigate } from "react-router-dom";
import { SudokuPlayer } from "../components/Sudoku/Player";
import { Modal } from "@carbon/react";
import { boardFromString, boardToShortString, validateBoardString } from "../utils/sudokuUtils";
import { Error } from "../components/Error";
import { useSavedPuzzles } from "../hooks/useSavedPuzzles";
import { useCallback, useEffect, useState } from "react";

// const getMostRecentlyPlayed = (savedPuzzles: SavedPuzzles): string | null => {
//   const keys = Object.keys(savedPuzzles);
//   if (keys.length === 0) {
//     return null;
//   }
//   keys.sort((a, b) => {
//     return savedPuzzles[b].lastPlayed - savedPuzzles[a].lastPlayed;
//   });
//   return keys[0];
// }

export const SudokuPlayerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { loading, error, dailyPuzzles } = useDailyPuzzles()
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


  // useEffect(() => {
  //   if (boardParam === null) {
  //     const boardFromRecentlyPlayed = getMostRecentlyPlayed(savedPuzzles);
  //     if (boardFromRecentlyPlayed !== null) {
  //       navigate(`?board=${boardFromRecentlyPlayed}`, { replace: true } );
  //     } else {
  //       // if (dailyPuzzles !== null) {
  //       //   const board = boardFromString(dailyPuzzles.easy.clues);
  //       //   if (board !== null) {
  //       //     navigate(`?board=${dailyPuzzles.easy.clues}`, { replace: true });
  //       //   }
  //       // }
  //     }
  //   }
  // }, [boardParam, navigate, savedPuzzles, ]);
  
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

  // if (loading) {
  //   return <Loading description="Loading daily puzzles" withOverlay={true} />
  // }
  // if (error) {
  //   return <Error message={error} />
  // }
  if (boardParam === null) {
    return <Error message="No board found" />
  }

  const board = boardFromString(boardParam);
  if (board === null) {
    return <Error message="Invalid board" />
  }

  return (
  <>
    <SudokuPlayer initialState={board} />
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
  </>
  );
};
