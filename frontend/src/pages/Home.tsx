import { Content, Button, ButtonSet, ButtonSkeleton, Stack, Tile, Grid, Column, ClickableTile } from "@carbon/react";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { History } from "../components/History";
import { SudokuCard } from "../components/SudokuCard";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        <History savedPuzzles={Object.fromEntries(recentPuzzles)} onRemove={removePuzzle}/>
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
  return (
      <Stack gap={4}>
        <h1>Sudoku</h1>
        <p>Pick up where you left off choose from a variety of puzzles from the library, or make your own puzzle to your desired specifications!</p>
        <RecentTile />
        {/* <DailyPuzzlesTile /> */}
        <GeneratorTile />
      </Stack>
  );
}
