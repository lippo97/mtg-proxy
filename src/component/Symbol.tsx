import { FC, useMemo } from "react";
import { Box } from "@mui/joy";

interface SymbolProps {
  kind: string;
  shadow?: boolean;
}

export const Symbol: FC<SymbolProps> = ({ kind, shadow }) => {
  const className = useMemo(() => {
    if (kind.toLowerCase() === "t") {
      return "tap";
    }
    return kind.replace("/", "").toLowerCase();
  }, [kind]);
  return (
    <Box
      component="abbr"
      className={`ms ms-cost ${shadow ? "ms-shadow" : ""} ms-${className}`}
      sx={{
        ml: "4px",
        ".comma + &": {
          ml: 0,
        },
        "&:first-child": {
          ml: "0",
        },
        "& + .ms-cost": {
          ml: "2px",
        },
        "& + *": {
          ml: "4px",
        },
        fontSize: "0.85em",
        mt: "-3px",
      }}
    />
  );
};
