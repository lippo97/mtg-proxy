import React, {
  useEffect, useRef,
  useState
} from "react";

export function useFitText(): {
  ref: React.RefObject<HTMLDivElement>;
  fontSize: number;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(9.5);

  useEffect(() => {
    const isOverflow = !!ref.current &&
      (ref.current.scrollHeight > ref.current.offsetHeight);
    if (isOverflow) {
      setFontSize(x => x - 0.5);
    }
  }, [ref, fontSize]);
  return { ref, fontSize };
}
