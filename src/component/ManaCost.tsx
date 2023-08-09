import { FC } from "react";
import { Color } from "../types/colors";
import { Symbol } from "./Symbol";

interface ManaCostProps {
  readonly mana: Color[];
}

export const ManaCost: FC<ManaCostProps> = ({ mana }) =>
  mana.map((x, i) => <Symbol key={i} kind={x} />);