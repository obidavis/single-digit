import { Content, Button, ButtonSet, ButtonSkeleton, Stack, Tile, Grid, Column, ClickableTile, FlexGrid, Row, Layer, Link as CarbonLink } from "@carbon/react";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { History } from "../components/History";
import { SudokuCard, SudokuCardList } from "../components/GameCard";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BoardView } from "../components/Player/BoardView";
import { difficultyDescription } from "../utils/sudokuUtils";
import { Launch } from "@carbon/react/icons";

const RecentTile = () => {
  const { savedGames: savedPuzzles, removePuzzle } = useSavedPuzzlesStore();
  // Only show the most recent 5 puzzles
  const recentPuzzles = Object.entries(savedPuzzles).sort((a, b) => {
    return b[1].lastPlayed - a[1].lastPlayed;
  }).slice(0, 5);
  return (
    <Tile>
      <Stack gap={4}>
        <h4>Recent</h4>
        <div className="sudoku-card-container">
          {recentPuzzles.map(([id, puzzle], i) => (
              <SudokuCard key={id} puzzle={puzzle.puzzle} cells={puzzle.cells} resume/>
          ))}
        </div>
        <Link to="/history">View All</Link>
      </Stack>
    </Tile>
  );
}

const DailyPuzzlesTile = () => {
  const { dailyPuzzles } = useDailyPuzzles();
  if (dailyPuzzles === null) {
    return (
      <Tile>
        <Stack gap={4}>
          <h4>Daily Puzzles</h4>
          <>
            <ButtonSkeleton />
            <ButtonSkeleton />
            <ButtonSkeleton />
          </>
        </Stack>
      </Tile>
    );
  }

  return (
    <Tile>
      <Stack gap={4}>
        <h4>Daily Puzzles</h4>
        <Grid fullWidth>
          <Column sm={1} md={2} lg={4}>
            <SudokuCard puzzle={dailyPuzzles.easy} />
          </Column>
          <Column sm={1} md={2} lg={4}>
            <SudokuCard puzzle={dailyPuzzles.moderate} />
          </Column>
          <Column sm={1} md={2} lg={4}>
            <SudokuCard puzzle={dailyPuzzles.tough} />
          </Column>
        </Grid>
        {/* <ButtonSet>
          <Button as={Link} to={`/play?board=${dailyPuzzles.easy.clues}`}>Easy</Button>
          <Button as={Link} to={`/play?board=${dailyPuzzles.moderate.clues}`}>Moderate</Button>
          <Button as={Link} to={`/play?board=${dailyPuzzles.tough.clues}`}>Tough</Button>
        </ButtonSet> */}
      </Stack>
    </Tile>
  )
}

const GeneratorTile = () => {
  const navigate = useNavigate();
  return (
      <Stack gap={4}>
        <h4>Generate</h4>
        <p>Create a custom puzzle</p>
        <ButtonSet stacked>
          <Button kind="tertiary" size="md" onClick={() => navigate('/play/difficulty/easy')}>
            <Stack gap={4}>
              Easy
            </Stack>
          </Button>
          <Button kind="tertiary" size="md" onClick={() => navigate('/play/difficulty/moderate')}>
            <Stack gap={4}>
              Moderate
            </Stack>
          </Button>
          <Button kind="tertiary" size="md" onClick={() => navigate('/play/difficulty/tough')}>
            <Stack gap={4}>
              Tough
            </Stack>
          </Button>
          <Button kind="tertiary" size="md" onClick={() => navigate('/play/difficulty/hard')}>
            <Stack gap={4}>
              Hard
            </Stack>
          </Button>  
        </ButtonSet>
      </Stack>
  );
}


export const HomePage = () => {
  const navigate = useNavigate();
  const { savedGames } = useSavedPuzzlesStore();
  const recentGames = Object.entries(savedGames).sort((a, b) => {
    return b[1].lastPlayed - a[1].lastPlayed;
  }).map(([_, game]) => game).slice(0, 3);

  const now = new Date();
  
  return (<Stack gap={4}>
    <Layer>
      {recentGames.length > 0 && (
        <Stack gap={4}>
          <h3>Continue</h3>
          <SudokuCardList recentGames={recentGames} />
          <CarbonLink href="/history">View All</CarbonLink>
        </Stack>
      )}
    </Layer>
  <h3>New Game</h3>
  <p>Generate a new puzzle with a given difficulty</p>
  <ButtonSet stacked>
    <Button style={{ color: "black" }} size="md" kind="secondary" onClick={() => navigate('/play/difficulty/easy')} renderIcon={Launch}>
      <p>Easy</p>
    </Button>
    <Button style={{ color: "black"}} size="md" kind="secondary" onClick={() => navigate('/play/difficulty/moderate')} renderIcon={Launch}>
      <p>Moderate</p>
    </Button>
    <Button style={{ color: "black"}} size="md" kind="secondary" onClick={() => navigate('/play/difficulty/tough')} renderIcon={Launch}>
      <p>Tough</p>
    </Button>
    <Button style={{ color: "black"}} size="md" kind="secondary" onClick={() => navigate('/play/difficulty/hard')} renderIcon={Launch}>
      <p>Hard</p>
    </Button>
  </ButtonSet>
  </Stack>);
}
