import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { SudokuPlayer } from "../components/Player";
import { Content, Header, HeaderContainer, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuItem, HeaderName, HeaderNavigation, Loading, Modal } from "@carbon/react";
import { boardFromString, boardToShortString, difficultyDescription, validateBoardString } from "../utils/sudokuUtils";
import { Error } from "../components/Error";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { useCallback, useEffect, useState, useMemo } from "react";
import { PuzzleSet } from "../models/SudokuAPI";
import { freshGameState } from "../models/Sudoku";
import { ChevronLeft, Settings, Share } from "@carbon/react/icons";

export const renderPlayerUI = () => {
  return (
    <>
      <Header aria-label='header'>
        <HeaderName as={Link} to='/' prefix='' href='/'>
          <ChevronLeft /> 
        </HeaderName>
        <HeaderNavigation aria-label='menu'>
          <HeaderMenuItem as={Link} to={"/play"}>
            Play
          </HeaderMenuItem>
        </HeaderNavigation>
      </Header>
      <Content style={{ maxWidth: 'none', justifyContent: 'center', padding: "1rem" }}>
        <Outlet />
      </Content>
    </>
  )
}

interface LocationState {
  resume?: boolean;
  difficulty?: number;
  solution?: string;
}

const fetchGeneratedPuzzle = (difficulty: string) => {
  return fetch('/api/generate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ difficulty })
    }
  ).then(response => response.json());
}

export const PlayerPage = () => {
  const { board, level } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { resume, difficulty, solution } = (location.state || {}) as LocationState;
  const [loading, setLoading] = useState(false);
  const removePuzzle = useSavedPuzzlesStore((state) => state.removePuzzle);
  const savedPuzzle = board !== undefined ? useSavedPuzzlesStore.getState().savedGames[board] : undefined;
  const hasSavedProgress = Boolean(savedPuzzle);


  const handleStartOver = useCallback(() => {
    removePuzzle(board!);
    navigate(`/play/${board}`, { replace: true, state: { resume: false } });
  }, [board, removePuzzle, navigate]);

  const handleContinue = useCallback(() => {
    navigate(`/play/${board}`, { state: { resume: true } });
  }, [board, navigate]);

  // Fetch puzzle if no board is provided
  useEffect(() => {
    if (!board) {
      setLoading(true);
      fetchGeneratedPuzzle(level || "any")
        .then((puzzles: PuzzleSet) => {
          const { clues, solution, difficulty } = puzzles.puzzles[0];
          setLoading(false);
          navigate(`/play/${clues}`, { replace: true, state: { difficulty, solution } });
        });
    } else {
      setLoading(false);
    }
  }, [board, level, navigate]);

  // Define the initial game state
  const gameState = (() => {
    console.log("gameState", { resume, savedPuzzle, board, solution, difficulty });
    if (resume && savedPuzzle) {
      return savedPuzzle;
    }
    return freshGameState({
      clues: board || "",
      solution: solution || "",
      difficulty: difficulty || 0,
    });
  })();

  if (board && !validateBoardString(board)) {
    return <Error message="Invalid board string" />;
  }

  if (loading) {
    return <Loading description="Loading puzzle" withOverlay active />;
  }

  return (
    <>
    <HeaderContainer render={() => (
      <>
        <Header aria-label='header' className="play-header">
          <HeaderGlobalAction aria-label="Back" onClick={() => navigate("/")} tooltipAlignment="start">
            <ChevronLeft /> 
          </HeaderGlobalAction>
          <HeaderName as={Link} to='/' prefix="SingleDigit">
            Sudoku
          </HeaderName>
          {/* <span style={{ width: "100%", textAlign: "center" }}>
            {`Difficulty: ${difficultyDescription(gameState.puzzle.difficulty)}`}</span> */}
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Share" onClick={() => {}} tooltipAlignment="center">
              <Share />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Settings" onClick={() => {}} tooltipAlignment="end">
              <Settings />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>
      </>
    )} />
    <Content style={{ maxWidth: 'none', justifyContent: 'center', padding: "1rem" }}>
      <SudokuPlayer initialState={gameState} key={resume ? "1" : "0"} />
      <Modal
        open={hasSavedProgress && !resume}
        modalHeading="Continue?"
        primaryButtonText="Continue"
        secondaryButtonText="Start Over"
        onRequestClose={handleStartOver}
        onRequestSubmit={handleContinue}
      />
    </Content>
    </>
  );
};
