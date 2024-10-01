import {
  Form,
  Button,
  Select,
  SelectItem,
  NumberInput,
  Stack,
  DataTable,
  Table,
  TableHead,
  TableRow,
  Grid,
  Row,
  Tile,
  Column,
  Content,

} from "@carbon/react";
import {
  BoardView
} from "../components/Sudoku/BoardView";
import "../components/Sudoku/Sudoku.scss";
import { Board } from "../models/Sudoku";
import { useState } from "react";

interface GeneratorResults {
  puzzles: {
    clues: string;
    solution: string;
    difficulty: number;
  }[];
}

export const MiniBoard = ({ clues }: { clues: string }) => {
  const cells = clues.split('').map((c, i) => ({
    index: i,
    value: c === '0' ? 0 : parseInt(c),
    candidates: [],
    isClue: c !== '0',
  }));
  const board: Board = { cells };
  return (
    <Grid>
      <Column sm={3}>
        <BoardView board={board} />
      </Column>
    </Grid>
    )
}

export const SudokuGeneratorPage = () => {
  const [results, setResults] = useState<GeneratorResults | null>();
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    setLoading(true);
    setError(null);
    setResults(null);

    fetch('/api/generate', {
      method: 'POST',
      body: data,
    }).then(response => response.json())
      .then(data => {
        setResults(data);
        setLoading(false);
        setError(null);
      })
      .catch(error => setError(error));
  }
  return (
    <Content>
      <Stack gap={10}>
        <Form onSubmit={handleSubmit} >
          <Stack gap={5}>
            <Select
              id="difficulty"
              name="difficulty"
              labelText="Difficulty"
              helperText="Select the difficulty of the puzzle"
              defaultValue="easy"
            >
              <SelectItem value="easy" text="Easy" />
              <SelectItem value="moderate" text="Moderate" />
              <SelectItem value="tough" text="Tough" />
              <SelectItem value="random" text="Random" />
            </Select>
            <NumberInput id="seed" name="seed" label="seed" defaultValue={-1} min={-1} />
            <NumberInput id="count" name="count" label="count" defaultValue={1} min={0} />
            <Button type="submit">Generate</Button>
          </Stack>
        </Form>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {results && (
          results.puzzles.map((puzzle, i) => (
            <MiniBoard key={i} clues={puzzle.clues} />
          ))
        )}
      </Stack>
    </Content>
  );
}
