import { Content, Button, ButtonSet, ButtonSkeleton, Stack, Tile, Grid, Column } from "@carbon/react";
import { useDailyPuzzles } from "../hooks/useDailyPuzzles";
import { useSavedPuzzlesStore } from "../hooks/useSavedPuzzles";
import { History } from "../components/Sudoku/History";
import { SudokuCard } from "../components/SudokuCard";

const RecentTile = () => {
  const { savedPuzzles, removePuzzle } = useSavedPuzzlesStore();
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
        <Grid>
          <Column sm={4}>
            <SudokuCard clues={dailyPuzzles.easy.clues} />
          </Column>
          <Column sm={4}>
            <SudokuCard clues={dailyPuzzles.moderate.clues} />
          </Column>
          <Column sm={4}>
            <SudokuCard clues={dailyPuzzles.tough.clues} />
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
  return (
    <Tile>
      <Stack gap={4}>
        <h4>Generator</h4>
        <p>Unimplemented :(</p>
      </Stack>
    </Tile>
  );
}

export const SudokuPage = () => {
  return (
    <Content>
      <Stack gap={4}>
        <h1>Sudoku</h1>
        <p>Pick up where you left off choose from a variety of puzzles from the library, or make your own puzzle to your desired specifications!</p>
        <RecentTile />
        <DailyPuzzlesTile />
        <GeneratorTile />
      </Stack>
    </Content>
  );
}
