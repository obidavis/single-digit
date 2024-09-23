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

const mockFetchDailyPuzzles = async (date: string): Promise<DailyPuzzles> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const easy = "000800500006109000150070060000090007020000910500004000080900072000240800007003000";
      const moderate = "070030000030109004009402000008000200004008905091700600000905400900200030000080050";
      const tough = "000006001030000004000472060300001200704060900001700003080915000900000030200080000";
      const mockData: DailyPuzzles = {
        date: date,
        easy: {
          clues: easy,
          solution: easy
        },
        moderate: {
          clues: moderate,
          solution: moderate
        },
        tough: {
          clues: tough,
          solution: tough
        }
      };
      resolve(mockData);
    }, 1000);
  });
}

const fetchDailyPuzzles = async (date: string): Promise<DailyPuzzles> => {
  const storedPuzzles = getStoredDailyPuzzles(date);
  if (storedPuzzles) {
    return storedPuzzles;
  }
  const puzzles = await mockFetchDailyPuzzles(date);
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
