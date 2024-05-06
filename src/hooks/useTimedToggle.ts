import { useCallback, useState } from "react";

export function useTimedToggle(
  duration: number
): [boolean, () => void] {
  const [state, setState] = useState(false);


  const setEnabled = useCallback(() => {
    setState(true);

    const id = setTimeout(() => {
      setState(false);
    }, duration);

    return () => clearTimeout(id);
  }, [duration]);

  return [state, setEnabled];
}