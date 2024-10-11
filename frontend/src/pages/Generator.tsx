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
  Loading,

} from "@carbon/react";
import {
  BoardView
} from "../components/Player/BoardView";
// import "../components/Player/Sudoku.scss";
import { SudokuGameState } from "../models/Sudoku";
import { useState } from "react";
import { Puzzle } from "../models/SudokuAPI";
import { SudokuCard } from "../components/GameCard";

interface GeneratorResults {
  puzzles: Puzzle[];
  
}

export const GeneratorPage = () => {
  const [results, setResults] = useState<GeneratorResults | null>();
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    setLoading(true);
    setError(null);
    setResults(null);

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => response.json())
      .then(data => {
        setResults(data);
        setLoading(false);
        setError(null);
      })
      .catch(error => setError(error));
  }
  return (
    <>
    <Loading active={loading} withOverlay/>
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
          <NumberInput allowEmpty id="seed" name="seed" label="seed" defaultValue={0} min={0} />
          <Button type="submit">Generate</Button>
        </Stack>
      </Form>
      {error && <p>Error: {error}</p>}
      {results && (
        results.puzzles.map((puzzle, i) => (
          <SudokuCard key={i} puzzle={puzzle} />
        ))
      )}
    </Stack>
    </>
  );
}
