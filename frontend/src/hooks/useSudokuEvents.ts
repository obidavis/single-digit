import { useKeyPress } from "./useKeyPress";

export const useNumberInput = (callback: (number: number) => void) => {
  useKeyPress({
    targetKey: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    callback: (e) => {
      callback(parseInt(e.key));
    }
  });
};

export const useArrowInput = (callback: (dx: number, dy: number) => void) => {
  useKeyPress({
    targetKey: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    callback: (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          callback(0, -1);
          break;
        case "ArrowDown":
          callback(0, 1);
          break;
        case "ArrowLeft":
          callback(-1, 0);
          break;
        case "ArrowRight":
          callback(1, 0);
          break;
      }
    }
  });
}