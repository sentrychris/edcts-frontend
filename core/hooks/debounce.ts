import { useEffect, useState } from "react";

export const useDebounce = (value: any, timeout: number) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);

    const handler = setTimeout(() => {
      return setState(value);
    }, timeout);
    return () => clearTimeout(handler);
  }, [value, timeout]);

  return state;
};
