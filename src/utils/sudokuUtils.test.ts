import {
  boardFromString,
  boardToShortString,
  boardToLongString,
} from './sudokuUtils';

describe('sudokuUtils', () => {
  describe('two-way conversion', () => {
    test('boardToShortString -> boardFromString', () => {
      const boardString = '300967001040302080020000070070000090000873000500010003004705100905000207800621004'
      const board = boardFromString(boardString);
      expect(board).not.toBeNull();
      expect(boardToShortString(board!)).toEqual(boardString);
    });
    test('boardToLongString -> boardFromString', () => {
      const boardString = '09vuvug12141vuvu03vu0hvu09vu05vu81vuvu05vuvuvuvuvu41vuvu41vuvuvuvuvug1vuvuvuvu814109vuvuvu11vuvuvu03vuvuvu09vuvu0h41vu1103vuvug1vu11vuvuvu05vu4181vuvu210503vuvu0h'
      const board = boardFromString(boardString);
      expect(board).not.toBeNull();
      expect(boardToLongString(board!)).toEqual(boardString);
    });
  });
});


