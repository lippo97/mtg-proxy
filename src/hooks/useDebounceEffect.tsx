import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export function useDebounceEffect<A>(input: A, delay: number, f: (a: A) => void) {
  const [debouncedInput] = useDebounce(input, delay);
  useEffect(() => {
    f(debouncedInput);
  }, [debouncedInput, f]);
}
