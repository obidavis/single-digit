import { useEffect, useState } from 'react';

declare type Puzzle = {
  clues: string
  solution: string
};

declare type DailyPuzzles = {
  date: string;
  easy: Puzzle;
  moderate: Puzzle;
  tough: Puzzle;
};

const getStoredDailyPuzzles = (date: string): DailyPuzzles | null => {
  const storedPuzzles = localStorage.getItem('dailyPuzzles');
  if (storedPuzzles) {
    const parsedPuzzles = JSON.parse(storedPuzzles) as DailyPuzzles;
    if (parsedPuzzles.date === date) {
      return parsedPuzzles;
    }
  }
  return null;
};

const storeDailyPuzzles = (puzzles: DailyPuzzles, date: string) => {
  localStorage.setItem('dailyPuzzles', JSON.stringify(puzzles));
}

const fetchDailyPuzzles = async (date: string): Promise<DailyPuzzles> => {
  const storedPuzzles = getStoredDailyPuzzles(date);
  if (storedPuzzles) {
    return storedPuzzles;
  }
  const puzzles = await fetch('http://localhost/api/daily-puzzles').then((res) => res.json());
  storeDailyPuzzles(puzzles, date);
  return puzzles;
}

export const useDailyPuzzles = () => {
  const today = new Date().toISOString().split('T')[0];
  const [dailyPuzzles, setDailyPuzzles] = useState<DailyPuzzles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchDailyPuzzles(today)
      .then((puzzles) => {
        if (!ignore) {
          setDailyPuzzles(puzzles);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { ignore = true; };
  }, [today]);

  return { dailyPuzzles, loading, error };
};
