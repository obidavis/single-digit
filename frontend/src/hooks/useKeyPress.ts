import { useEffect } from "react"

interface KeyPressArgs {
  targetKey: string | string[];
  modifierKeys?: string[];
  callback: (e: KeyboardEvent) => void;
}

export const useKeyPress = ({ targetKey, modifierKeys, callback }: KeyPressArgs) => {
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (modifierKeys && modifierKeys.some(key => !e.getModifierState(key))) {
        return;
      }
      if (Array.isArray(targetKey) && !targetKey.includes(e.key)) {
        return;
      }

      if (Array.isArray(targetKey) && targetKey.includes(e.key)) {
        callback(e);
        return;
      }

      if (e.key === targetKey) {
        callback(e);
      }
    }

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    }
  }, []);
}
